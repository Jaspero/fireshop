import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'jms-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {}
