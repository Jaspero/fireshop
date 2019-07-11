import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LightboxComponent} from '../../shared/components/lightbox/lightbox.component';

@Component({
  selector: 'jfs-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  constructor(private dialog: MatDialog) {}

  year = new Date().getFullYear();

  openLightbox() {
    this.dialog.open(LightboxComponent, {
      data: {
        images: [
          'https://firebasestorage.googleapis.com/v0/b/jaspero-site.appspot.com/o/foodiesfeed.com_' +
            'fresh-carrots-from-a-market.jpg?alt=media&token=ecae1723-80b1-416d-88ad-dc276ceacbb3',

          'https://firebasestorage.googleapis.com/v0/b/jaspero-site.appspot.com/o' +
            '/foodiesfeed.com_strawberry-mango-peach-smoothies.jpg?alt=media&token=cf0873e1-cf55-4ff3-8ad1-bb949591b91e'
        ]
      }
    });
  }
}
