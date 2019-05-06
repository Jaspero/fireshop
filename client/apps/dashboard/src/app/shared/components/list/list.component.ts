import {SelectionModel} from '@angular/cdk/collections';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AngularFirestore, CollectionReference} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatBottomSheet, MatDialog, MatSort} from '@angular/material';
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
  debounceTime,
  map,
  scan,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {FirebaseOperator} from 'shared/enums/firebase-operator.enum';
import {FirestoreCollections} from 'shared/enums/firestore-collections.enum';
import {PAGE_SIZES} from '../../consts/page-sizes.const';
import {RouteData} from '../../interfaces/route-data.interface';
import {StateService} from '../../services/state/state.service';
import {ExportComponent} from '../export/export.component';

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

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild('filterDialog')
  filterDialog: TemplateRef<any>;

  items$: Observable<T[]>;
  allChecked$: Observable<{checked: boolean}>;
  loadMore$ = new Subject<boolean>();
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

    this.setItems();

    this.allChecked$ = combineLatest(
      this.items$,
      this.selection.changed.pipe(startWith(null))
    ).pipe(
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

  setItems() {
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
          debounceTime(400),
          tap(filters => {
            this.options.filters = filters;
            this.state.setRouteData(this.options);
          })
        )
      );
    }

    this.items$ = merge(...listeners).pipe(
      startWith(null),
      switchMap(() => {
        this.dataLoading$.next(true);

        let items;

        return this.loadItems(true).pipe(
          switchMap(data => {
            items = data;

            this.dataLoading$.next(true);

            return this.loadMore$.pipe(startWith(false));
          }),
          switchMap(toDo => {
            if (toDo) {
              return this.loadItems();
            } else {
              return of(items);
            }
          }),
          scan((acc, cur) => acc.concat(cur), []),
          tap(() => this.dataLoading$.next(false))
        );
      })
    );
  }

  loadItems(...args): Observable<any>;
  loadItems(reset = false) {
    if (reset) {
      this.cursor = null;
    }

    return this.afs
      .collection<T>(this.collection, ref => {
        let final = ref;

        if (this.options.pageSize) {
          final = final.limit(this.options.pageSize) as CollectionReference;
        }

        if (this.options.sort) {
          final = final.orderBy(
            this.options.sort.active,
            this.options.sort.direction
          ) as CollectionReference;
        }

        final = this.runFilters(final);

        if (this.cursor) {
          final = final.startAfter(this.cursor) as CollectionReference;
        }

        return final;
      })
      .get()
      .pipe(
        map(actions => {
          if (actions.docs.length) {
            this.cursor = actions.docs[actions.docs.length - 1];

            this.hasMore$.next(true);

            return actions.docs.map(action => ({
              id: action.id,
              ...(action.data() as any)
            }));
          }

          this.hasMore$.next(false);

          return [];
        })
      );
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
