import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface SliderData extends FieldData {
  validation: {
    minimum: number;
    maximum: number;
  };
  thumbLabel: boolean;
  tickInterval: number;
  min: number;
  max: number;
}

@Component({
  selector: 'jms-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent extends FieldComponent<SliderData> {}
