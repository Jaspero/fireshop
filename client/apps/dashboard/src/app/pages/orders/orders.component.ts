import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'jfsc-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent {}
