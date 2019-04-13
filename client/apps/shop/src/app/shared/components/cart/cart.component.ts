import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CartService} from '../../services/cart/cart.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {StateService} from '../../services/state/state.service';
import {Router} from '@angular/router';
import * as nanoid from 'nanoid';
import {AngularFireAuth} from '@angular/fire/auth';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ReviewsDialogComponent} from '../reviews/reviews-dialog.component';

@Component({
  selector: 'jfs-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  constructor(
    public dialogRef: MatDialogRef<CartComponent>,
    public cart: CartService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private state: StateService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  loader: boolean;

  // todo: we need to enhance checkout system
  checkOut() {
    this.loader = true;
    const orderId = nanoid();

    this.afs
      .collection(`${FirestoreCollections.Orders}`)
      .doc(orderId)
      .set({
        customerId: this.afAuth.auth.currentUser.uid,
        name: this.afAuth.auth.currentUser.displayName,
        orderId,
        status: 'delivery set'
      })
      .finally(() => {
        console.log('success');
      });

    const today = Date.now();

    this.cart.items$.value.forEach(item => {
      this.afs
        .collection(`${FirestoreCollections.OrderedItems}`)
        .doc(nanoid())
        .set({
          ...item,
          time: today,
          customerId: this.afAuth.auth.currentUser.uid,
          name: this.afAuth.auth.currentUser.displayName,
          orderId
        })
        .finally(() => {
          this.cart.clear();
          this.loader = false;
          this.router.navigate(['/']);
        });
    });
  }

  navigate(data) {
    this.router.navigate(['/product'], {
      queryParams: {product: data}
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
