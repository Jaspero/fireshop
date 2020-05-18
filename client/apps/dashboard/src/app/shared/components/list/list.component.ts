import {SelectionModel} from '@angular/cdk/collections';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  AngularFirestore,
  CollectionReference,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {confirmation} from '@jf/utils/confirmation';
import {notify} from '@jf/utils/notify.operator';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  from,
  merge,
  Observable,
  of,
  Subject
} from 'rxjs';
import {
  map,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {FirebaseOperator} from 'shared/enums/firebase-operator.enum';
import {FirestoreCollections} from 'shared/enums/firestore-collections.enum';
import {PAGE_SIZES} from '../../consts/page-sizes.const';
import {Role} from '../../enums/role.enum';
import {RouteData} from '../../interfaces/route-data.interface';
import {StateService} from '../../services/state/state.service';
import {ExportComponent} from '../export/export.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'jfsc-list',
  template: ''
})
export class ListComponent<T extends {id: any}, R extends RouteData = RouteData>
  extends RxDestroy
  implements OnInit {
  constructor(
    public state: StateService,
    public afs: AngularFirestore,
    public fb: FormBuilder,
    public router: Router,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) {
    super();
  }

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  @ViewChild('filterDialog', {static: true})
  filterDialog: TemplateRef<any>;

  items$: Observable<T[]>;
  allChecked$: Observable<{checked: boolean}>;
  loadMore$ = new Subject<boolean>();
  emptyState$ = new BehaviorSubject(false);
  dataLoading$ = new BehaviorSubject(true);
  hasMore$ = new BehaviorSubject(true);
  chips$: Observable<Array<{filter: string; value: string}>>;

  selection = new SelectionModel<string>(true, []);
  pageSizes = PAGE_SIZES;
  cursor: any = null;
  collection: FirestoreCollections;
  options: R;
  pageSize: FormControl;
  filters: FormGroup;
  additionalRouteData = {
    filters: {
      search: ''
    }
  };

  get collectionRef() {
    return of(this.collection as string);
  }

  get readMode() {
    return this.state.role === Role.Read;
  }

  ngOnInit() {
    this.options = this.state.getRouterData({
      sort: {
        direction: 'desc',
        active: 'createdOn'
      },
      pageSize: 10,
      ...this.additionalRouteData
    });
    this.pageSize = new FormControl(this.options.pageSize);
    this.filters = this.fb.group(this.options.filters);

    this.items$ = this.collectionRef.pipe(
      switchMap(collection => this.setItems(collection)),
      shareReplay(1)
    );

    this.allChecked$ = combineLatest([
      this.items$,
      this.selection.changed.pipe(startWith(null))
    ]).pipe(
      map(([items]) => ({
        checked: this.selection.selected.length === items.length
      }))
    );

    this.chips$ = this.filters.valueChanges.pipe(
      startWith(this.options.filters),
      map(values => {
        const final = [];
        for (const filter in values) {
          if (values[filter] !== null && values[filter] !== '') {
            final.push({filter, value: values[filter]});
          }
        }
        return final;
      })
    );
  }

  setItems(collection: string) {
    const listeners = [];

    if (this.options.sort) {
      listeners.push(
        this.sort.sortChange.pipe(
          tap((sort: any) => {
            this.options.sort = sort;
            this.state.setRouteData(this.options);
          })
        )
      );
    }

    if (this.options.pageSize) {
      listeners.push(
        this.pageSize.valueChanges.pipe(
          tap(pageSize => {
            this.options.pageSize = pageSize;
            this.state.setRouteData(this.options);
          })
        )
      );
    }

    if (this.options.filters) {
      listeners.push(
        this.filters.valueChanges.pipe(
          tap(filters => {
            this.options.filters = filters;
            this.state.setRouteData(this.options);
          })
        )
      );
    }

    return merge(...listeners).pipe(
      startWith(null),
      switchMap(() => {
        this.dataLoading$.next(true);

        return this.getCollection(collection, null, this.options.pageSize)
          .snapshotChanges(['added'])
          .pipe(take(1));
      }),
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
              this.dataLoading$.next(true);
              return this.getCollection(
                collection,
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
          ),

          this.getCollection(collection, null, null)
            .stateChanges()
            .pipe(
              skip(1),
              tap(snaps => {
                snaps.forEach(snap => {
                  const index = docs.findIndex(
                    doc => doc.id === snap.payload.doc.id
                  );

                  switch (snap.type) {
                    case 'added':
                      if (index === -1) {
                        docs.push({
                          id: snap.payload.doc.id,
                          ...snap.payload.doc.data()
                        });
                      }
                      break;
                    case 'modified':
                      if (index !== -1) {
                        docs[index] = {
                          id: snap.payload.doc.id,
                          ...snap.payload.doc.data()
                        };
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
          startWith(null),
          map(() => {
            this.dataLoading$.next(false);
            return [...docs];
          })
        );
      })
    );
  }

  getCollection(
    collection: string,
    cursor?: QueryDocumentSnapshot<T>,
    pageSize?: number
  ) {
    return this.afs.collection<T>(collection, ref => {
      let final = ref;

      if (pageSize) {
        final = final.limit(pageSize) as CollectionReference;
      }

      if (this.options.sort) {
        final = final.orderBy(
          this.options.sort.active,
          this.options.sort.direction
        ) as CollectionReference;
      }

      final = this.runFilters(final);

      if (cursor) {
        final = final.startAfter(cursor) as CollectionReference;
      }

      return final;
    });
  }

  runFilters(ref) {
    if (this.options.filters.search) {
      ref = ref.where(
        'name',
        FirebaseOperator.LargerThenOrEqual,
        this.options.filters.search
      );
    }

    return ref;
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

  deleteOne(item: T) {
    confirmation([switchMap(() => this.delete(item.id)), notify()]);
  }

  deleteSelection() {
    confirmation([
      switchMap(() =>
        forkJoin(this.selection.selected.map(id => this.delete(id)))
      ),
      notify()
    ]);
  }

  delete(id: string): Observable<any> {
    return from(
      this.afs
        .collection(this.collection)
        .doc(id)
        .delete()
    );
  }

  goToSingle(item: T) {
    this.router.navigate(['/', this.collection, item]);
  }

  export() {
    this.bottomSheet.open(ExportComponent, {
      data: {
        collection: this.collection,
        ids: this.selection.selected
      }
    });
  }

  // TODO: Implement
  import() {}

  openFilter() {
    this.dialog.open(this.filterDialog, {
      width: '400px'
    });
  }

  changeFilters(event) {
    this.filters.get(event).setValue('');
  }

  resetAll() {
    this.filters.reset();
  }
}
