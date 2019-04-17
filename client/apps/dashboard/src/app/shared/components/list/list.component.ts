import {SelectionModel} from '@angular/cdk/collections';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatBottomSheet, MatDialog, MatSort} from '@angular/material';
import {Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {confirmation} from '@jf/utils/confirmation';
import {FirebaseOperator} from 'shared/enums/firebase-operator.enum';
import {FirestoreCollections} from 'shared/enums/firestore-collections.enum';
import {notify} from 'shared/utils/notify.operator';
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
import {ExportComponent} from '../export/export.component';
import {PAGE_SIZES} from '../../consts/page-sizes.const';
import {RouteData} from '../../interfaces/route-data.interface';
import {StateService} from '../../services/state/state.service';

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
      search: '',
      category: ''
    }
  };

  // TODO: Pull from settings
  realTime = false;

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

    // TODO: This follows product filters. It needs to be made reusable
    this.chips$ = this.filters.valueChanges.pipe(
      startWith(this.options.filters),
      map(values => {
        const final = [];
        for (const filter in values) {
          if (values[filter]) {
            if (filter === 'category') {
              final.push({filter, value: values[filter].name});
            } else {
              final.push({filter, value: values[filter]});
            }
          }
        }
        return final;
      })
    );
  }

  setItems() {
    this.items$ = merge(
      this.sort.sortChange.pipe(
        tap((sort: any) => {
          this.options.sort = sort;
          this.state.setRouteData(this.options);
        })
      ),

      this.pageSize.valueChanges.pipe(
        tap(pageSize => {
          this.options.pageSize = pageSize;
          this.state.setRouteData(this.options);
        })
      ),

      this.filters.valueChanges.pipe(
        debounceTime(400),
        tap(filters => {
          this.options['filters'] = filters;
          this.state.setRouteData(this.options);
        })
      )
    ).pipe(
      startWith(null),
      switchMap(() => {
        this.dataLoading$.next(true);

        let items;

        return this.loadItems(this.realTime, true).pipe(
          switchMap(data => {
            items = data;
            this.dataLoading$.next(true);
            return this.loadMore$.pipe(startWith(false));
          }),
          switchMap(toDo => {
            if (toDo) {
              return this.loadItems(false);
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

  loadItems(...args: any): Observable<any>;
  loadItems(continues: boolean, reset = false) {
    if (reset) {
      this.cursor = null;
    }

    const changes = this.afs
      .collection<T>(this.collection, ref => {
        let final = ref
          .limit(this.options.pageSize)
          .orderBy(this.options.sort.active, this.options.sort.direction);

        final = this.runFilters(final);

        if (this.cursor) {
          final = final.startAfter(this.cursor);
        }

        return final;
      })
      .snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length) {
            this.cursor = actions[actions.length - 1].payload.doc;

            this.hasMore$.next(true);

            return actions.map(action => ({
              id: action.payload.doc.id,
              ...(action.payload.doc.data() as any)
            }));
          }

          this.hasMore$.next(false);

          return [];
        })
      );

    /**
     * If data shouldn't be streamed continually
     * we only take one emit from the stream
     */
    if (!continues) {
      changes.pipe(take(1));
    }

    return changes;
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

  // TODO: Implement
  export() {
    this.bottomSheet.open(ExportComponent);
  }

  // TODO: Implement
  import() {}

  openFilter() {
    this.dialog.open(this.filterDialog, {
      width: '400px'
    });
  }

  changeFilters(event) {
    console.log(123);
    this.filters.get(event).setValue('');
  }

  resetAll() {
    this.filters.reset();
  }
}
