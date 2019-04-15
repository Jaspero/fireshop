import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'jfs-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  constructor(private router: Router) {}

  links = [
    {
      label: 'Wish List',
      route: 'wish-list'
    },
    {
      label: 'Reviews',
      route: 'reviews'
    },
    {
      label: 'Orders',
      route: 'orders'
    },
    {
      label: 'Settings',
      route: 'settings'
    }
  ];

  activeLink: any;

  ngOnInit() {
    const url = this.router.url.replace('/my-profile/', '');
    this.activeLink = this.links.find(val => val.route === url);
  }
}
