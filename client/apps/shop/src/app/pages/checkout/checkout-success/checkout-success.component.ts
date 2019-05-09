import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import {Order} from '@jf/interfaces/order.interface';
import {CartService} from '../../../shared/services/cart/cart.service';
import {StateService} from '../../../shared/services/state/state.service';

@Component({
  selector: 'jfs-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  constructor(public cartService: CartService, private state: StateService) {}

  result: Partial<Order>;

  ngOnInit() {
    this.result = this.state.checkoutResult as Partial<Order>;
    this.cartService.clear();
  }

  ngOnDestroy() {
    localStorage.removeItem('result');
  }
}
