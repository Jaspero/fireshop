import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {CartService} from '../../services/cart/cart.service';
import {StateService} from '../../services/state/state.service';

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
    private router: Router
  ) {}

  checkOut() {
    this.router.navigate(['/checkout']);
    this.closeDialog();
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
