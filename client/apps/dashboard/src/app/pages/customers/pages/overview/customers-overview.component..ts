import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {GiftCard} from '@jf/interfaces/gift-card.interface';
import {Order} from '@jf/interfaces/order.interface';
import {Review} from '@jf/interfaces/review.interface';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-overview',
  templateUrl: './customers-overview.component.html',
  styleUrls: ['./customers-overview.component.css']
})
export class CustomersOverviewComponent extends RxDestroy implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {
    super();
  }

  data$: Observable<{
    customer: Customer;
    orders: Order[];
    reviews: Review[];
    giftCard: GiftCard[];
  }>;

  ngOnInit() {
    this.data$ = this.activatedRoute.params.pipe(
      switchMap(user =>
        forkJoin([
          this.afs
            .doc(`${FirestoreCollections.Customers}/${user.id}`)
            .get()
            .pipe(
              map(res => ({
                id: res.id,
                ...(res.data() as Customer)
              }))
            ),
          this.afs
            .collection(FirestoreCollections.Orders, ref =>
              ref.where('customerId', FirebaseOperator.Equal, user.id)
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
              ref.where('customerId', FirebaseOperator.Equal, user.id)
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
            .collection(FirestoreCollections.GiftCardsInstances, ref =>
              ref.where('usedBy', FirebaseOperator.Equal, user.id)
            )
            .get()
            .pipe(
              map(actions =>
                actions.docs.map(action => ({
                  id: action.id,
                  ...(action.data() as GiftCard)
                }))
              )
            )
        ])
      ),
      map(data => ({
        customer: data[0],
        orders: data[1],
        reviews: data[2],
        giftCard: data[3]
      }))
    );
  }
}
