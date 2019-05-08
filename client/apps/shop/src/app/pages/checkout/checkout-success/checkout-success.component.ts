import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import {CartService} from '../../../shared/services/cart/cart.service';

@Component({
  selector: 'jfs-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  constructor(public cartService: CartService) {}

  result: {
    items: {};
    price: {};
    data: {};
  };

  ngOnInit() {
    this.result = JSON.parse(localStorage.getItem('success'));
  }

  ngOnDestroy() {
    this.cartService.clear();
    localStorage.removeItem('success');
  }
}
