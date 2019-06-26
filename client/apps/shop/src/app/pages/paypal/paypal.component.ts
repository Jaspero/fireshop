import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef} from '@angular/core';

declare var paypal;

// todo: add to index.html with script tag because they want script is to up to date all the time
// <script src="https://www.paypal.com/sdk/js?client-id=ARNRNvgJTH0oaRUrQUC-p-MgCXzIOl5T6um6YqdW7U9mkwzV-ZkfCtp9c0QH6dRWArJY85Yh3rLCT5Vu">

@Component({
  selector: 'jfs-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaypalComponent implements OnInit {
  constructor() { }

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  product = {
    price: 777.77,
    description: 'test',
    img: 'assets/couch.jpg'
  };

  paidFor = false;

  ngOnInit() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: 'USD',
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          // todo: this should be on the backend side!
          const order = await actions.order.capture();
          this.paidFor = true;
          // console.log(order);
        },
        onError: err => {
          // console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }

}
