import {ChangeDetectionStrategy, Component} from '@angular/core';
import {pipe} from 'rxjs';
import {map} from 'rxjs/operators';
import {FieldComponent, FieldData} from '../../field/field.component';

interface SliderData extends FieldData {
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
export class SliderComponent extends FieldComponent<SliderData> {
  ngOnInit() {
    console.log(this.cData);
  }
}
