import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'jfs-checkout-error',
  templateUrl: './checkout-error.component.html',
  styleUrls: ['./checkout-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutErrorComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
