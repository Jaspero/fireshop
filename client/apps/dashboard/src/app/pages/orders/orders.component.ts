import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'jfsc-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit {
  constructor(private router: Router) {}

  links = [
    {
      label: 'Orders overview',
      route: '/orders'
    }
    /*{
      label: 'Create new order',
      route: 'new'
    }*/
  ];

  activeLink: any;

  ngOnInit() {
    const url = this.router.url.replace('/orders/', '');
    this.activeLink = this.links.find(val => val.route === url);
  }
}
