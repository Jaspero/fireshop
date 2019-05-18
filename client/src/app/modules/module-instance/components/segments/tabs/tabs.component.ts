import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SegmentComponent} from '../../segment/segment.component';

@Component({
  selector: 'jms-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent extends SegmentComponent {}
