import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {Discount} from '@jf/interfaces/discount.interface';
import {Order} from '@jf/interfaces/order.interface';
import {Product} from '@jf/interfaces/product.interface';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {firstOfMonth} from '../../shared/utils/first-date-month';

@Component({
  selector: 'jfsc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute
  ) {}

  orders = [];
  orders$: Observable<Order[]>;
  ordersInMonth$: Observable<Order[]>;
  data$: Observable<{
    categories: boolean;
    products: boolean;
    discounts: boolean;
  }>;

  ngOnInit() {
    this.orders$ = this.afs
      .collection<Order>(FirestoreCollections.Orders, ref => {
        return ref.orderBy('createdOn', 'desc').limit(3);
      })
      .valueChanges('id');

    // TODO: Uncomment for income chart
    // this.ordersInMonth$ = this.afs
    //   .collection<Order>(FirestoreCollections.Orders, ref => {
    //     return ref.where(
    //       'createdOn',
    //       FirebaseOperator.LargerThenOrEqual,
    //       firstOfMonth()
    //     );
    //   })
    //   .valueChanges('id');

    this.data$ = this.activatedRoute.params.pipe(
      switchMap(() =>
        forkJoin([
          this.afs
            .collection<Category>(
              `${FirestoreCollections.Categories}-${STATIC_CONFIG.lang}`,
              ref => ref.limit(1)
            )
            .get()
            .pipe(map(actions => !!actions.docs.length)),
          this.afs
            .collection<Product>(
              `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`,
              ref => ref.limit(1)
            )
            .get()
            .pipe(map(actions => !!actions.docs.length)),
          this.afs
            .collection<Discount>(
              `${FirestoreCollections.Discounts}-${STATIC_CONFIG.lang}`,
              ref => ref.limit(1)
            )
            .get()
            .pipe(map(actions => !!actions.docs.length))
        ])
      ),
      map(data => ({
        categories: data[0],
        products: data[1],
        discounts: data[2]
      }))
    );
  }
}
