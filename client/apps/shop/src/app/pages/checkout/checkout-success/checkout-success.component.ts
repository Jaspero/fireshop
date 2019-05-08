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
    items: Array<{
      attributes: {};
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    price: {
      shipping: number;
      subTotal: number;
      total: number;
    };
    data: {
      city: string;
      country: string;
      email: string;
      firstName: string;
      lastName: string;
      line1: string;
      line2: string;
      phone: string;
      zip: string;
    };
    shipping?: string;
  };

  ngOnInit() {
    this.result = JSON.parse(localStorage.getItem('success'));
  }

  ngOnDestroy() {
    this.cartService.clear();
    localStorage.removeItem('success');
  }
}
