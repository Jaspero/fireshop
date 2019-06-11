import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface RadioData extends FieldData {
  options: Array<{
    disabled: boolean;
    value: any;
    label: string;
  }>;
}

@Component({
  selector: 'jms-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent extends FieldComponent<RadioData> {}
