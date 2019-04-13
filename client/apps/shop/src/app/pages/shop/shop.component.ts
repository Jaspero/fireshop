import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {RxDestroy} from '@jaspero/ng-helpers';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  scan,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {LoginSignupDialogComponent} from '../../shared/components/login-signup-dialog/login-signup-dialog.component';
import {Category} from '../../shared/interfaces/category.interface';
import {Product} from '../../shared/interfaces/product.interface';
import {CartService} from '../../shared/services/cart/cart.service';

@Component({
  selector: 'jfs-products',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent extends RxDestroy implements OnInit {
  constructor(
    public cart: CartService,
    public dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) {
    super();
  }

  filters: FormGroup;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  @ViewChild('filterDialog') filterDialog: TemplateRef<any>;

  products$: Observable<Product[]>;
  loading$ = new BehaviorSubject(true);
  loadMore$ = new BehaviorSubject(null);
  hasMore$ = new BehaviorSubject(true);

  pageSize = 6;
  cursor: any = null;
  orderName = 'Price High - Low';
  orderList = [
    // todo(kole): should we uncomment
    // {
    //   name: 'Latest',
    //   type: 'createdOn',
    //   direction: 'desc'
    // },
    // {
    //   name: 'Oldest',
    //   type: 'createdOn',
    //   direction: 'asc'
    // },
    {
      name: 'Price High - Low',
      type: 'price',
      direction: 'desc'
    },
    {
      name: 'Price Low - High',
      type: 'price',
      direction: 'asc'
    },
    {
      name: 'Name A - Z',
      type: 'name',
      direction: 'asc'
    },
    {
      name: 'Name Z - A',
      type: 'name',
      direction: 'desc'
    }
  ];
  chipArray = [];
  priceLimit: number;
  categories: any;

  ngOnInit() {
    this.filters = this.fb.group({
      category: '',
      order: '',
      price: null
    });

    this.viewPort.scrolledIndexChange
      .pipe(
        filter(() => this.hasMore$.value),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.loadMore$.next(true);
      });

    this.afs
      .collection<Category>(
        `${FirestoreCollections.Categories}-${STATIC_CONFIG.lang}`
      )
      .snapshotChanges()
      .subscribe(actions => {
        this.categories = actions.map(action => ({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        }));
      });

    this.products$ = this.filters.valueChanges.pipe(
      startWith(this.filters.getRawValue()),
      switchMap(query => {
        this.hasMore$.next(true);

        this.cursor = null;

        return this.loadMore$.pipe(
          debounceTime(300),
          tap(() => this.loading$.next(true)),
          switchMap(() =>
            this.afs
              .collection<Product>(
                `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`,
                ref => {
                  let final = ref
                    .limit(this.pageSize)
                    .where('active', FirebaseOperator.Equal, true);

                  this.chipArray = [];

                  if (query.order.name) {
                    this.chipArray.push({
                      filter: 'order',
                      value: query.order.name
                    });

                    final = final.orderBy(
                      query.order.type,
                      query.order.direction
                    );
                  }

                  if (query.category) {
                    this.chipArray.push({
                      filter: 'category',
                      value: query.category.name
                    });

                    final = final.where(
                      'category',
                      FirebaseOperator.Equal,
                      query.category.id
                    );
                  }

                  if (query.price) {
                    this.chipArray.push({
                      filter: 'price',
                      value: query.price
                    });

                    final = final.where(
                      'price',
                      FirebaseOperator.LargerThenOrEqual,
                      query.price
                    );
                  }

                  if (this.cursor) {
                    final = final.startAfter(this.cursor);
                  }
                  return final;
                }
              )
              .snapshotChanges()
          ),
          map(actions => {
            if (actions.length < this.pageSize) {
              this.hasMore$.next(false);
            } else {
              this.cursor = actions[actions.length - 2].payload.doc;
            }
            return actions.reduce((acc, cur, ind) => {
              if (ind < this.pageSize - 1) {
                acc.push({
                  id: cur.payload.doc.id,
                  ...cur.payload.doc.data()
                });
              }
              return acc;
            }, []);
          }),
          scan((acc, curr) => acc.concat(curr), [])
        );
      }),
      tap(() => {
        this.loading$.next(false);
        setTimeout(() => {
          if (
            !this.viewPort.measureScrollOffset('bottom') &&
            this.hasMore$.value
          ) {
            this.loadMore$.next(true);
          }
        }, 10);
      })
    );
  }

  openFilter() {
    this.dialog.open(this.filterDialog, {
      width: '400px'
    });
  }

  removeChip(chip) {
    this.filters.get(chip.filter).setValue('');
  }

  updateOrder(order) {
    this.filters.get('order').setValue(order);
    this.orderName = order.name;
  }

  formatRateLabel(value: number) {
    this.priceLimit = value;
    return value;
  }

  setCategory(id: string) {
    this.filters.get('category').setValue(id);
  }

  logInOrAddToWishList() {
    if (this.afAuth.auth.currentUser) {
      // TODO: WHEN USER IS LOGGED IN, HE CAN EDIT(ADD || REMOVE) HIS WISH LIST
    } else {
      this.dialog.open(LoginSignupDialogComponent, {
        width: '400px',
        height: '700px'
      });
    }
  }
}
