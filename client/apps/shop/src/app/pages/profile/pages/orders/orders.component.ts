import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {AngularFireAuth} from '@angular/fire/auth';
import {takeUntil} from 'rxjs/operators';
import {RxDestroy} from '@jaspero/ng-helpers';
import {ReviewsDialogComponent} from '../../../../shared/components/reviews/reviews-dialog.component';

@Component({
  selector: 'jfs-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent extends RxDestroy implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    super();
  }

  orders: any;

  ngOnInit() {
    this.afs
      .collection(`${FirestoreCollections.Orders}`, ref => {
        return ref.where(
          'customerId',
          FirebaseOperator.Equal,
          this.afAuth.auth.currentUser.uid
        );
      })
      .valueChanges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.orders = value.map(x => {
          x['orderList'] = [];
          return x;
        });
        this.cdr.detectChanges();
      });
  }

  getOrder(id, ind) {
    if (!this.orders[ind].orderList.length) {
      this.afs
        .collection(`${FirestoreCollections.OrderedItems}`, ref => {
          return ref.where('orderId', FirebaseOperator.Equal, id);
        })
        .valueChanges()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(value => {
          this.orders[ind].orderList.push(...value);
        });
    }
  }

  submitReview(productId, order) {
    this.dialog.open(ReviewsDialogComponent, {
      width: '500px',
      data: {
        customerName: order.name,
        customerId: order.customerId,
        orderId: order.orderId,
        productId: productId,
        createdOn: Date.now()
      }
    });
  }
}
