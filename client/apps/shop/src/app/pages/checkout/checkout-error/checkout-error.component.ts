import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {Router} from '@angular/router';
import {CartService} from '../../../shared/services/cart/cart.service';

@Component({
  selector: 'jfs-checkout-error',
  templateUrl: './checkout-error.component.html',
  styleUrls: ['./checkout-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutErrorComponent implements OnInit, OnDestroy {
  constructor(
    public cartService: CartService,
    private cdk: ChangeDetectorRef,
    private router: Router
  ) {}

  error: Array<any>;

  ngOnInit() {
    this.error = JSON.parse(localStorage.getItem('error'));
  }

  ngOnDestroy() {
    localStorage.removeItem('error');
  }

  resolveIssue() {
    const array = this.cartService.items$.getValue();
    this.error.forEach(er => {
      switch (er.type) {
        case 'product_missing':
          const ind = array.findIndex(x => x.productId === er.data);
          array.splice(ind, 1);
          break;
        case 'quantity_insufficient':
          const ind2 = array.findIndex(x => x.productId === er.data);
          array[ind2].quantity = 1;
          break;
      }
    });
    localStorage.setItem('cartItem', JSON.stringify(array));
    this.router.navigate(['/']);
  }

  clearCart() {
    this.cartService.clear();
    this.router.navigate(['/']);
  }
}
