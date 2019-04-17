import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'jfs-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  constructor(private router: Router, public afAuth: AngularFireAuth) {}

  links = [
    {
      label: 'Settings',
      route: 'settings'
    },
    {
      label: 'Wish List',
      route: 'wish-list'
    },
    {
      label: 'Orders',
      route: 'orders'
    },
    {
      label: 'Reviews',
      route: 'reviews'
    }
  ];

  activeLink: any;

  ngOnInit() {
    const url = this.router.url.replace('/my-profile/', '');
    this.activeLink = this.links.find(val => val.route === url);
  }
}
