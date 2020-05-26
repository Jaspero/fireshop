import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'jfs-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {}
