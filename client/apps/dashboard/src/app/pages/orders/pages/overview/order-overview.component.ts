import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Order} from '@jf/interfaces/order.interface';
import {Review} from '@jf/interfaces/review.interface';
import {forkJoin, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss']
})
export class OrderOverviewComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  data$: Observable<any>;

  ngOnInit() {
    this.data$ = this.activatedRoute.params.pipe(
      switchMap(identifier => {
        let order: Order;

        return this.afs
          .collection(FirestoreCollections.Orders)
          .doc(identifier.id)
          .get()
          .pipe(
            map(res => ({
              id: res.id,
              ...res.data()
            }))
          )
          .pipe(
            switchMap((data: Order) => {
              order = data;

              if (data.customerId) {
                return forkJoin(
                  data.orderItems.map(productId =>
                    this.afs
                      .collection(FirestoreCollections.Reviews, ref => {
                        return ref
                          .where(
                            'customerId',
                            FirebaseOperator.Equal,
                            data.customerId
                          )
                          .where('orderId', FirebaseOperator.Equal, data.id)
                          .where(
                            'productId',
                            FirebaseOperator.Equal,
                            productId
                          );
                      })
                      .get()
                      .pipe(
                        map(actions =>
                          actions.docs.map(action => ({
                            id: action.id,
                            ...(action.data() as Review)
                          }))
                        )
                      )
                  )
                );
              } else {
                return of([]);
              }
            }),
            map(reviews => ({
              order,
              reviews
            }))
          );
      })
    );
  }
}
