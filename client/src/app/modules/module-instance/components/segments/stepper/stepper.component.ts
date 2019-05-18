import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SegmentComponent} from '../../segment/segment.component';

@Component({
  selector: 'jms-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent extends SegmentComponent {}
