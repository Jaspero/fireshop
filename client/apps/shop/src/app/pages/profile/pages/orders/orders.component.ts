import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LoadState} from '@jf/enums/load-state.enum';
import {UNIQUE_ID, UNIQUE_ID_PROVIDER} from '@jf/utils/id.provider';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ReviewsDialogComponent} from '../../../../shared/components/reviews/reviews-dialog.component';

@Component({
  selector: 'jfs-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UNIQUE_ID_PROVIDER]
})
export class OrdersComponent extends RxDestroy implements OnInit {
  constructor(
    @Inject(UNIQUE_ID)
    public uniqueId: string,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    super();
  }

  dataState = LoadState;
  state$ = new BehaviorSubject<{
    state: LoadState;
    data: any;
  }>({
    state: LoadState.Loading,
    data: []
  });

  orders: any;

  ngOnInit() {
    this.afs
      .collection(FirestoreCollections.Orders, ref => {
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
        this.state$.next({
          state: value.length ? LoadState.Loaded : LoadState.Empty,
          data: value.map(x => {
            x['orderList'] = [];
            return x;
          })
        });
        this.cdr.detectChanges();
      });
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
