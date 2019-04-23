import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'jfs-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutSuccessComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
