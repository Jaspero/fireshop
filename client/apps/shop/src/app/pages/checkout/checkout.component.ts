import {Component, OnInit} from '@angular/core';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {FormBuilder, FormGroup} from '@angular/forms';

declare const Stripe: any;

@Component({
  selector: 'jfs-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  constructor() {}

  stripeKey = ENV_CONFIG.stripe.token;
  stripe: any;
  cardObj: any;
  error: any;

  ngOnInit() {
    this.stripe = Stripe(this.stripeKey);
    this._setupCard();
  }

  private _setupCard() {
    const elements = this.stripe.elements();

    const cardElement = elements.create('card');
    // cardElement.mount('#card-element');
  }
}
