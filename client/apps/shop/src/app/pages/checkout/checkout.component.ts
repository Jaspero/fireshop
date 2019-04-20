import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {environment} from '../../../environments/environment';
import {CartService} from '../../shared/services/cart/cart.service';
import {HttpClient} from '@angular/common/http';

declare const Stripe: any;

@Component({
  selector: 'jfs-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  constructor(private cartService: CartService, private _http: HttpClient) {}

  @ViewChild('card')
  cardEl: ElementRef;

  stripe: any;
  cardObj: any;
  error: any;

  @Input()
  style: any = {};

  @Output()
  cardChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.stripe = Stripe(ENV_CONFIG.stripe.token);
  }

  ngAfterViewInit() {
    const elements = this.stripe.elements();
    this.cardObj = elements.create('card');
    this.cardObj.mount(this.cardEl.nativeElement);

    this.cardObj.addEventListener('change', event => {
      this.error = event.error ? event.error.message : null;
      this.cardChange.next({element: this.cardObj, ...event});
    });
  }

  sendRequest() {
    const orderedItems = this.cartService.items$.getValue().map(val => ({
      id: val.productId,
      quantity: val.quantity
    }));

    this._http
      .post(`${environment.restApi}/stripe/checkout`, {
        orderedItems
      })
      .subscribe(res => {
        console.log(res);
      });
  }
}
