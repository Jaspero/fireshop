import {SelectionModel} from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import {FormControl} from '@angular/forms';
import {MatSort} from '@angular/material';
import {get, has} from 'json-pointer';
// @ts-ignore
import * as nanoid from 'nanoid';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  from,
  merge,
  Observable,
  Subject
} from 'rxjs';
import {
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {PAGE_SIZES} from '../../../../shared/consts/page-sizes.const';
import {
  TableColumn,
  TableSort
} from '../../../../shared/interfaces/module.interface';
import {RouteData} from '../../../../shared/interfaces/route-data.interface';
import {StateService} from '../../../../shared/services/state/state.service';
import {confirmation} from '../../../../shared/utils/confirmation';
import {notify} from '../../../../shared/utils/notify.operator';
import {ModuleInstanceComponent} from '../../module-instance.component';
import {ColumnPipe} from '../../pipes/column.pipe';

interface InstanceOverview {
  id: string;
  name: string;
  displayColumns: string[];
  tableColumns: TableColumn[];
  sort?: TableSort;
}

@Component({
  selector: 'jms-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceOverviewComponent implements OnInit {
  constructor(
    private moduleInstance: ModuleInstanceComponent,
    private afs: AngularFirestore,
    private state: StateService
  ) {}

  @ViewChild(MatSort)
  sort: MatSort;

  data$: Observable<InstanceOverview>;
  items$: Observable<any[]>;
  loading$: Observable<boolean>;
  allChecked$: Observable<{checked: boolean}>;
  emptyState$ = new BehaviorSubject(false);
  hasMore$ = new BehaviorSubject(false);
  loadMore$ = new Subject<boolean>();

  selection = new SelectionModel<string>(true, []);
  pageSizes = PAGE_SIZES;
  columnPipe: ColumnPipe;
  pageSize: FormControl;
  options: RouteData;

  ngOnInit() {
    this.options = this.state.getRouterData({
      pageSize: 10
    });
    this.pageSize = new FormControl(this.options.pageSize);
    this.columnPipe = new ColumnPipe();

    this.data$ = this.moduleInstance.module$.pipe(
      map(data => {
        let displayColumns: string[];
        let tableColumns: TableColumn[];

        if (
          data.layout &&
          data.layout.table &&
          data.layout.table.tableColumns
        ) {
          displayColumns = data.layout.table.tableColumns.reduce(
            (acc, column) => {
              let key =
                typeof column.key === 'string' ? column.key : column.key[0];

              if (acc.includes(key)) {
                key = nanoid();
              }

              acc.push(key);

              return acc;
            },
            []
          );
          tableColumns = data.layout.table.tableColumns;
        } else {
          const topLevelProperties = Object.keys(data.schema.properties || {});

          displayColumns = topLevelProperties.reduce((acc, key) => {
            acc.push(key || nanoid());
            return acc;
          }, []);
          tableColumns = topLevelProperties.map(key => ({
            // Make the key a valid json pointer
            key: '/' + key,
            label: key
          }));
        }

        /**
         * Default displayColumns
         */
        displayColumns.unshift('check');
        displayColumns.push('actions');

        return {
          id: data.id,
          name: data.name,
          displayColumns,
          tableColumns
        };
      }),
      shareReplay(1)
    );

    this.loading$ = this.state.loadingQue$.pipe(map(items => !!items.length));

    this.items$ = this.data$.pipe(
      switchMap(data =>
        this.pageSize.valueChanges.pipe(
          startWith(this.options.pageSize),
          tap(pageSize => {
            this.options.pageSize = pageSize;
            this.state.setRouteData(this.options);
          }),
          switchMap(pageSize =>
            this.getCollection(data.id, null, pageSize)
              .snapshotChanges(['added'])
              .pipe(take(1))
          ),
          switchMap(snapshots => {
            let cursor;

            if (snapshots.length < this.options.pageSize) {
              this.hasMore$.next(false);
            }

            if (snapshots.length) {
              cursor = snapshots[snapshots.length - 1].payload.doc;
              this.emptyState$.next(false);
            } else {
              this.emptyState$.next(true);
            }

            const docs = snapshots.map(item => ({
              id: item.payload.doc.id,
              ...item.payload.doc.data()
            }));

            return merge(
              this.loadMore$.pipe(
                switchMap(() => {
                  return this.getCollection(
                    data.id,
                    cursor,
                    this.options.pageSize
                  )
                    .snapshotChanges(['added'])
                    .pipe(
                      take(1),
                      tap(snaps => {
                        if (snaps.length < this.options.pageSize) {
                          this.hasMore$.next(false);
                        }

                        if (snaps.length) {
                          cursor = snaps[snaps.length - 1].payload.doc;

                          docs.push(
                            ...snaps.map(item => ({
                              id: item.payload.doc.id,
                              ...item.payload.doc.data()
                            }))
                          );
                        }
                      })
                    );
                })
              )
            ).pipe(
              startWith(null),
              map(() => [...docs])
            );
          })
        )
      )
    );
  }

  getCollection(
    collection: string,
    cursor?: QueryDocumentSnapshot<any>,
    pageSize?: number
  ) {
    return this.afs.collection(collection, ref => {
      let final = ref;

      if (pageSize) {
        final = final.limit(pageSize) as CollectionReference;
      }

      if (cursor) {
        final = final.startAfter(cursor) as CollectionReference;
      }

      return final;
    });
  }

  getColumnValue(column: TableColumn, rowData: any) {
    if (typeof column.key !== 'string') {
      return column.key
        .map(key => this.getColumnValue({key}, rowData))
        .join(column.hasOwnProperty('join') ? column.join : ', ');
    } else {
      if (has(rowData, column.key)) {
        return this.columnPipe.transform(
          get(rowData, column.key),
          column.pipe,
          column.pipeArguments
        );
      } else {
        return '';
      }
    }
  }

  trackById(index, item) {
    return item.id;
  }

  masterToggle() {
    combineLatest(this.allChecked$, this.items$)
      .pipe(take(1))
      .subscribe(([check, items]) => {
        if (check.checked) {
          this.selection.clear();
        } else {
          items.forEach(row => this.selection.select(row.id));
        }
      });
  }

  deleteOne(instance: InstanceOverview, item: any) {
    confirmation([
      switchMap(() => this.delete(instance.id, item.id)),
      notify()
    ]);
  }

  deleteSelection(instance: InstanceOverview) {
    confirmation([
      switchMap(() =>
        forkJoin(
          this.selection.selected.map(id => this.delete(instance.id, id))
        )
      ),
      notify()
    ]);
  }

  delete(collection: string, id: string) {
    return from(
      this.afs
        .collection(collection)
        .doc(id)
        .delete()
    );
  }
}
