import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {RxDestroy} from '@jaspero/ng-helpers';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {Product} from '@jf/interfaces/product.interface';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, switchMap, tap, throttleTime} from 'rxjs/operators';
import {CartService} from '../../shared/services/cart/cart.service';
import {StateService} from '../../shared/services/state/state.service';

import * as firebase from 'firebase';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import FieldPath = firebase.firestore.FieldPath;

@Component({
  selector: 'jfs-products',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent extends RxDestroy implements OnInit {
  filters: FormGroup;

  @ViewChild('filterDialog', {static: true})
  filterDialog: TemplateRef<any>;

  // .next() anything on this and more products will load
  loadMore$ = new BehaviorSubject<boolean>(null);

  // With BehaviorSubject no twitches during loading of new products
  products$ = new BehaviorSubject([]);

  // Last loaded product, so it is easier to tell firestore startAfter with specific field
  lastProduct: Product = null;

  // When scrolled this close from bottom, load more products
  loadOffset = 200;

  // Whether there are still products to load from firestore
  productsLeft = true;
  pageSize = 6;
  limit = 6;
  orderName = 'Name A - Z';
  sortByList = [
    {
      name: 'Latest',
      type: 'createdOn',
      direction: 'desc'
    },
    {
      name: 'Oldest',
      type: 'createdOn',
      direction: 'asc'
    },
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
  categories$: Observable<Category[]>;
  primaryCurrency = DYNAMIC_CONFIG.currency.primary;

  @ViewChild('productList')
  private productList: ElementRef;

  constructor(
    public cart: CartService,
    public dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private state: StateService
  ) {
    super();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - this.loadOffset
    ) {
      this.loadMore$.next(true);
    }
  }

  initProducts() {
    this.filters.valueChanges
      .pipe(
        throttleTime(1000),
        tap(filters => {
          this.lastProduct = null;
          this.productsLeft = true;
          this.products$.next([]);
          this.loadMore$.next(true);
        })
      )
      .subscribe();

    this.loadMore$
      .pipe(
        switchMap(loadMore => {
          if (!this.productsLeft) {
            return of([]);
          }

          const filters = this.filters.getRawValue();
          return this.afs
            .collection<Product>(
              `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`,
              ref => {
                let final = ref.where('active', FirebaseOperator.Equal, true);

                this.chipArray = [];
                if (filters.order && filters.order.name) {
                  const type =
                    filters.order.type !== 'price'
                      ? filters.order.type
                      : new FieldPath('price', this.primaryCurrency);
                  final = final.orderBy(type, filters.order.direction);

                  if (filters.order.type === 'price') {
                    final = final.orderBy('name');
                  }
                } else {
                  final = final.orderBy('name');
                }

                if (filters.category) {
                  this.chipArray.push({
                    filter: 'category',
                    value: filters.category.name
                  });

                  final = final.where(
                    'category',
                    FirebaseOperator.Equal,
                    filters.category.id
                  );
                }

                if (filters.price) {
                  this.chipArray.push({
                    filter: 'price',
                    value: filters.price
                  });

                  final = final.where(
                    'price',
                    FirebaseOperator.LargerThenOrEqual,
                    filters.price
                  );
                }

                final = final.limit(this.limit);
                if (this.lastProduct) {
                  if (filters.order.type === 'price') {
                    final = final.startAfter(null);
                    final = final.startAfter(this.lastProduct.name);
                  } else {
                    final = final.startAfter(
                      this.lastProduct[filters.order.type]
                    );
                  }
                }
                return final;
              }
            )
            .snapshotChanges()
            .pipe();
        }),
        map(actions => {
          if (actions.length === 0) return [];

          const products = actions.reduce((acc, cur, ind) => {
            acc.push({
              id: cur.payload.doc.id,
              ...cur.payload.doc.data()
            });
            return acc;
          }, []);

          this.lastProduct = products[products.length - 1];

          return products;
        }),
        tap(data => {
          if (data.length === 0) return;

          if (data.length < this.pageSize) {
            this.productsLeft = false;
          }

          const newIds = new Set([]);
          data.map(product => {
            newIds.add(product.id);
          });

          // Check for duplicates when Dashboard user changes data
          const oldProducts = this.products$
            .getValue()
            .filter(product => !newIds.has(product.id));
          this.products$.next([...oldProducts, ...data]);
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.categories$ = this.afs
      .collection<Category>(
        `${FirestoreCollections.Categories}-${STATIC_CONFIG.lang}`,
        ref => ref.orderBy('order', 'asc')
      )
      .valueChanges({idField: 'id'});

    this.filters = this.fb.group({
      category: '',
      order: {
        name: 'Name A - Z',
        type: 'name',
        direction: 'asc'
      },
      price: null
    });
    this.initProducts();
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
}
