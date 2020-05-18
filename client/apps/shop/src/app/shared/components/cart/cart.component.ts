import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {CartService} from '../../services/cart/cart.service';
import {MatDialogRef} from '@angular/material/dialog';

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
