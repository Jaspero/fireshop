import {ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, QueryDocumentSnapshot} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {RxDestroy} from '@jaspero/ng-helpers';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {Product} from '@jf/interfaces/product.interface';
import {filter, map, scan, startWith, switchMap, take, takeUntil, throttleTime} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, fromEvent, Observable} from 'rxjs';
import {CartService} from '../../shared/services/cart/cart.service';

import * as firebase from 'firebase';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {animate, style, transition, trigger} from '@angular/animations';
import {queue} from '../../../../../dashboard/src/app/shared/utils/queue.operator';
import FieldPath = firebase.firestore.FieldPath;

@Component({
  selector: 'jfs-products',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('0.5s ease-out', style({opacity: '1'}))
      ])
    ])
  ]
})
export class ShopComponent extends RxDestroy implements OnInit {
  filters: FormGroup;

  @ViewChild('filterDialog', {static: true})
  filterDialog: TemplateRef<any>;

  products$: Observable<Product[]>;
  hasMore$ = new BehaviorSubject(true);
  loading$ = new BehaviorSubject(true);
  updatedFilters$ = new BehaviorSubject(false);
  cursor: QueryDocumentSnapshot<Product>;

  // When scrolled this close from bottom, load more products
  loadOffset = 400;
  pageSize = 13;

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
  categories$: Observable<Category[]>;
  primaryCurrency = DYNAMIC_CONFIG.currency.primary;

  @ViewChild('productList', {static: false})
  private productList: ElementRef;

  constructor(
    public cart: CartService,
    public dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) {
    super();
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

    this.filters.valueChanges.pipe(
      map(() => {
        this.cursor = null;
        this.hasMore$.next(true);
        this.updatedFilters$.next(true);

        // TODO: Alternative for firing products$ pipeline
        window.scroll(0, window.scrollY + 1);
        window.scroll(0, window.scrollY - 1);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this.hasMore$.next(true);
    this.products$ = fromEvent(window, 'scroll', {passive: true}).pipe(
      throttleTime(1000),
      switchMap(() => combineLatest([this.loading$, this.hasMore$]).pipe(take(1))
      ),
      filter(
        ([loading, hasMore]) =>
          !loading && hasMore &&
          window.innerHeight + window.scrollY >= document.body.offsetHeight - this.loadOffset
      ),
      startWith(window),
      switchMap(() => {
        this.loading$.next(true);

        const filters = this.filters.getRawValue();
        return this.afs
          .collection<Product>(
            `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`,
            ref => {
              let final = ref
                .limit(this.pageSize)
                .where('active', FirebaseOperator.Equal, true);

              this.chipArray = [];

              if (filters?.order?.name) {
                const type =
                  filters.order.type !== 'price'
                    ? filters.order.type
                    : new FieldPath('price', this.primaryCurrency);

                final = final.orderBy(type, filters.order.direction);

                if (filters.order.type === 'price') {
                  final = final.orderBy('name');
                }
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

              if (this.cursor) {
                final = final.startAfter(this.cursor);
              }

              return final;
            }
          ).get().pipe(
            queue(),
            take(1),
            map(actions => {
              this.loading$.next(false);

              if (actions.docs.length < this.pageSize) {
                this.hasMore$.next(false);
              } else {
                this.cursor = actions.docs[actions.docs.length - 2] as QueryDocumentSnapshot<Product>;
              }

              return actions.docs.reduce((acc, curr, ind) => {
                if (ind < this.pageSize - 1) {
                  acc.push({
                    id: curr.id,
                    ...curr.data()
                  });
                }
                return acc;
              }, []);

            })
          );

      }),
      scan((acc, curr) => {
        if (this.updatedFilters$.value) {
          this.updatedFilters$.next(false);
          return curr;
        }

        return acc.concat(curr);
      }, [])
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
}
