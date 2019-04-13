import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'jfsc-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent implements OnInit {
  constructor(private router: Router) {}

  links = [
    {
      label: 'Customers overview',
      route: '/customers'
    },
    {
      label: 'Create new customer',
      route: 'new'
    }
  ];

  activeLink: any;

  ngOnInit() {
    const url = this.router.url.replace('/customers/', '');
    this.activeLink = this.links.find(val => val.route === url);
  }
}
