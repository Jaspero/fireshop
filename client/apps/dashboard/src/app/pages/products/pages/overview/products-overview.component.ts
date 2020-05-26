import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {Order} from '@jf/interfaces/order.interface';
import {Review} from '@jf/interfaces/review.interface';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-products-overview',
  templateUrl: './products-overview.component.html',
  styleUrls: ['./products-overview.component.scss']
})
export class ProductsOverviewComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  data$: Observable<{
    orders: Order[];
    reviews: Review[];
    customers: Customer[];
  }>;

  ngOnInit() {
    this.data$ = this.activatedRoute.params.pipe(
      switchMap(identifier =>
        forkJoin([
          this.afs
            .collection(FirestoreCollections.Orders, ref =>
              ref.where(
                'orderItems',
                FirebaseOperator.ArrayContains,
                identifier.id
              )
            )
            .get()
            .pipe(
              map(actions =>
                actions.docs.map(action => ({
                  id: action.id,
                  ...(action.data() as Order)
                }))
              )
            ),

          this.afs
            .collection(FirestoreCollections.Reviews, ref =>
              ref.where('productId', FirebaseOperator.Equal, identifier.id)
            )
            .get()
            .pipe(
              map(actions =>
                actions.docs.map(action => ({
                  id: action.id,
                  ...(action.data() as Review)
                }))
              )
            ),

          this.afs
            .collection(FirestoreCollections.Customers, ref =>
              ref.where(
                'wishList',
                FirebaseOperator.ArrayContains,
                identifier.id
              )
            )
            .get()
            .pipe(
              map(actions =>
                actions.docs.map(action => ({
                  id: action.id,
                  ...(action.data() as Customer)
                }))
              )
            )
        ])
      ),
      map(data => ({
        orders: data[0],
        reviews: data[1],
        customers: data[2]
      }))
    );
  }
}
