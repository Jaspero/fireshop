import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
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

  error: Array<{
    data: {id: string; name: string; quantity: number};
    message: string;
    type: string;
  }>;

  ngOnInit() {
    this.error = JSON.parse(localStorage.getItem('error'));
  }

  ngOnDestroy() {
    localStorage.removeItem('error');
  }

  resolveIssue() {
    this.cartService.items$.pipe(take(1)).subscribe(items => {
      this.error.forEach(er => {
        const ind = items.findIndex(x => x.productId === er.data.id);
        switch (er.type) {
          case 'product_missing':
            items.splice(ind, 1);
            this.cartService.remove(er.data.id);
            break;
          case 'quantity_insufficient':
            items[ind].quantity = er.data.quantity;
            break;
        }
      });
      localStorage.setItem('cartItem', JSON.stringify(items));
      this.router.navigate(['/']);
    });
  }

  clearCart() {
    this.cartService.clear();
    this.router.navigate(['/']);
  }
}
