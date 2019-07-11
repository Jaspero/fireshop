import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'jfs-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  year = new Date().getFullYear();
}
