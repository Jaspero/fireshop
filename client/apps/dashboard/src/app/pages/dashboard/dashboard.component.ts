import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Order} from '@jf/interfaces/order.interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {firstOfMonth} from '../../shared/utils/first-date-month';

@Component({
  selector: 'jfsc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  constructor(private afs: AngularFirestore) {}

  orders = [];
  orders$: Observable<Order[]>;
  ordersInMonth$: Observable<Order[]>;

  ngOnInit() {
    this.orders$ = this.afs
      .collection<Order>(FirestoreCollections.Orders, ref => {
        return ref.orderBy('createdOn', 'desc').limit(3);
      })
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => ({
            id: action.payload.doc.id,
            ...action.payload.doc.data()
          }))
        )
      );

    this.ordersInMonth$ = this.afs
      .collection<Order>(FirestoreCollections.Orders, ref => {
        return ref.where(
          'createdOn',
          FirebaseOperator.LargerThenOrEqual,
          firstOfMonth()
        );
      })
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => ({
            id: action.payload.doc.id,
            ...action.payload.doc.data()
          }))
        )
      );
  }
}
