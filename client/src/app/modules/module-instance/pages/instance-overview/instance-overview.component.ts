import {SelectionModel} from '@angular/cdk/collections';
import {TemplatePortal} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSort} from '@angular/material/sort';
import {DomSanitizer} from '@angular/platform-browser';
import {RxDestroy} from '@jaspero/ng-helpers';
import {get, has} from 'json-pointer';
import {JSONSchema7} from 'json-schema';
// @ts-ignore
import * as nanoid from 'nanoid';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  merge,
  Observable,
  Subject
} from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import {ExportComponent} from '../../../../shared/components/export/export.component';
import {PAGE_SIZES} from '../../../../shared/consts/page-sizes.const';
import {
  ModuleDefinitions,
  SortModule,
  TableColumn,
  TableSort
} from '../../../../shared/interfaces/module.interface';
import {RouteData} from '../../../../shared/interfaces/route-data.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {confirmation} from '../../../../shared/utils/confirmation';
import {notify} from '../../../../shared/utils/notify.operator';
import {SortDialogComponent} from '../../components/sort-dialog/sort-dialog.component';
import {InstanceSingleState} from '../../enums/instance-single-state.enum';
import {ModuleInstanceComponent} from '../../module-instance.component';
import {ColumnPipe} from '../../pipes/column.pipe';
import {Parser} from '../../utils/parser';

interface InstanceOverview {
  id: string;
  name: string;
  displayColumns: string[];
  definitions: ModuleDefinitions;
  tableColumns: TableColumn[];
  schema: JSONSchema7;
  sort?: TableSort;
  sortModule?: SortModule;
}

@Component({
  selector: 'jms-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceOverviewComponent extends RxDestroy
  implements OnInit, AfterViewInit {
  constructor(
    private dbService: DbService,
    private moduleInstance: ModuleInstanceComponent,
    private state: StateService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private domSanitizer: DomSanitizer
  ) {
    super();
  }

  /**
   * Using view children so we can listen for changes
   */
  @ViewChildren(MatSort)
  sort: QueryList<MatSort>;

  @ViewChild('simpleColumn', {static: true})
  simpleColumnTemplate: TemplateRef<any>;

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
  parserCache: {[key: string]: Parser} = {};

  ngOnInit() {
    this.options = this.state.getRouterData({
      pageSize: 10
    });
    this.pageSize = new FormControl(this.options.pageSize);
    this.columnPipe = new ColumnPipe(this.domSanitizer);

    this.data$ = this.moduleInstance.module$.pipe(
      map(data => {
        let displayColumns: string[];
        let tableColumns: TableColumn[];
        let sort: TableSort;

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

        if (data.layout && data.layout.table) {
          sort = data.layout.table.sort;
        }

        /**
         * Default displayColumns
         */
        displayColumns.unshift('check');
        displayColumns.push('actions');

        return {
          id: data.id,
          name: data.name,
          schema: data.schema,
          displayColumns,
          tableColumns,
          sort,
          definitions: data.definitions,
          sortModule: data.layout.sortModule
        };
      }),
      shareReplay(1)
    );

    this.loading$ = this.state.loadingQue$.pipe(map(items => !!items.length));
  }

  ngAfterViewInit() {
    this.items$ = this.data$.pipe(
      switchMap(data =>
        combineLatest([
          this.pageSize.valueChanges.pipe(startWith(this.options.pageSize)),
          ...(data.sort
            ? [
                this.sort.changes.pipe(
                  filter(change => change.last),
                  switchMap(change => change.last.sortChange),
                  startWith(data.sort)
                )
              ]
            : [])
        ]).pipe(
          switchMap(([pageSize, sort]) => {
            this.options.pageSize = pageSize as number;

            if (sort) {
              this.options.sort = sort as TableSort;
              this.options.sort.active = Parser.standardizeKey(
                this.options.sort.active
              );
            } else {
              this.options.sort = null;
            }

            this.state.setRouteData(this.options);

            return this.dbService.getDocuments(
              data.id,
              this.options.pageSize,
              this.options.sort,
              null
            );
          }),
          switchMap(snapshots => {
            let cursor;

            this.hasMore$.next(snapshots.length === this.options.pageSize);

            if (snapshots.length) {
              cursor = snapshots[snapshots.length - 1].payload.doc;
              this.emptyState$.next(false);
            } else {
              this.emptyState$.next(true);
            }

            const docs = snapshots.map(item => this.mapRow(data, item));

            return merge(
              this.loadMore$.pipe(
                switchMap(() =>
                  this.dbService
                    .getDocuments(
                      data.id,
                      this.options.pageSize,
                      this.options.sort,
                      cursor
                    )
                    .pipe(
                      tap(snaps => {
                        if (snaps.length < this.options.pageSize) {
                          this.hasMore$.next(false);
                        }

                        if (snaps.length) {
                          cursor = snaps[snaps.length - 1].payload.doc;

                          docs.push(
                            ...snaps.map(item => this.mapRow(data, item))
                          );
                        }
                      })
                    )
                )
              ),

              this.dbService.getStateChanges(data.id, null, null).pipe(
                skip(1),
                tap(snaps => {
                  snaps.forEach(snap => {
                    const index = docs.findIndex(
                      doc => doc.id === snap.payload.doc.id
                    );

                    switch (snap.type) {
                      case 'added':
                        if (index === -1) {
                          docs.push(this.mapRow(data, snap));
                        }
                        break;
                      case 'modified':
                        if (index !== -1) {
                          docs[index] = this.mapRow(data, snap);
                        }
                        break;
                      case 'removed':
                        if (index !== -1) {
                          docs.splice(index, 1);
                        }
                        break;
                    }
                  });
                })
              )
            ).pipe(
              startWith({}),
              map(() => [...docs])
            );
          })
        )
      ),
      shareReplay(1)
    );

    this.allChecked$ = combineLatest([
      this.items$,
      this.selection.changed.pipe(startWith({}))
    ]).pipe(
      map(([items]) => ({
        checked: this.selection.selected.length === items.length
      }))
    );
  }

  trackById(index, item) {
    return item.id;
  }

  masterToggle() {
    combineLatest([this.allChecked$, this.items$])
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
      switchMap(() => this.dbService.removeDocument(instance.id, item.id)),
      notify()
    ]);
  }

  deleteSelection(instance: InstanceOverview) {
    confirmation([
      switchMap(() =>
        forkJoin(
          this.selection.selected.map(id =>
            this.dbService.removeDocument(instance.id, id)
          )
        )
      ),
      notify()
    ]);
  }

  export(collection: string) {
    this.bottomSheet.open(ExportComponent, {
      data: {
        collection,
        ids: this.selection.selected
      }
    });
  }

  openSortDialog(
    collection: string,
    collectionName: string,
    options: SortModule
  ) {
    this.dialog.open(SortDialogComponent, {
      width: '800px',
      data: {
        options,
        collection,
        collectionName
      }
    });
  }

  private mapRow(
    overview: InstanceOverview,
    rowData: DocumentChangeAction<any>
  ) {
    const data = rowData.payload.doc.data();
    const id = rowData.payload.doc.id;

    return {
      data,
      id,
      parsed: this.parseColumns(overview, {...data, id})
    };
  }

  private parseColumns(overview: InstanceOverview, rowData: any) {
    return overview.tableColumns.reduce((acc, column, index) => {
      acc[index] = {
        value: this.getColumnValue(column, overview, rowData),
        ...(column.nestedColumns
          ? {
              nested: this.parseColumns(
                {...overview, tableColumns: column.nestedColumns},
                rowData
              )
            }
          : {})
      };
      return acc;
    }, {});
  }

  private getColumnValue(
    column: TableColumn,
    overview: InstanceOverview,
    rowData: any,
    nested = false
  ) {
    if (column.control) {
      const key = column.key as string;

      if (!this.parserCache[rowData.id]) {
        this.parserCache[rowData.id] = new Parser(
          overview.schema,
          this.injector,
          InstanceSingleState.Edit
        );
        this.parserCache[rowData.id].buildForm(rowData);
      }

      const field = this.parserCache[rowData.id].field(
        key,
        this.parserCache[rowData.id].pointers[key],
        overview.definitions,
        false
      );

      field.control.valueChanges
        .pipe(
          switchMap(value =>
            this.dbService.setDocument(
              overview.id,
              rowData.id,
              {
                [Parser.standardizeKey(key)]: value
              },
              {merge: true}
            )
          ),
          notify({
            success: null
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe();

      return field.portal;
    } else {
      let value;

      if (typeof column.key !== 'string') {
        value = column.key
          .map(key => this.getColumnValue({key}, overview, rowData, true))
          .join(column.hasOwnProperty('join') ? column.join : ', ');
      } else {
        if (has(rowData, column.key)) {
          value = this.columnPipe.transform(
            get(rowData, column.key),
            column.pipe,
            column.pipeArguments
          );
        } else {
          value = '';
        }
      }

      if (nested) {
        return value;
      } else {
        return new TemplatePortal(
          this.simpleColumnTemplate,
          this.viewContainerRef,
          {value}
        );
      }
    }
  }
}
