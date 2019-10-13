import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FieldData} from '../../../interfaces/field-data.interface';
import {FieldComponent} from '../../field/field.component';

interface SliderData extends FieldData {
  validation: {
    minimum: number;
    maximum: number;
  };
  thumbLabel: boolean;
  tickInterval: number;
  starAt: number;
  endAt: number;
}

@Component({
  selector: 'jms-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent extends FieldComponent<SliderData>
  implements OnInit {
  startAt: number;
  endAt: number;

  ngOnInit() {
    this.startAt = this.cData.starAt
      ? this.cData.starAt
      : this.cData.validation.minimum
      ? this.cData.validation.minimum
      : 0;
    this.endAt = this.cData.endAt
      ? this.cData.endAt
      : this.cData.validation.maximum
      ? this.cData.validation.maximum
      : 100;
  }
}
