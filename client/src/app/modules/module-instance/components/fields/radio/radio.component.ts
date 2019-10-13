import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldData} from '../../../interfaces/field-data.interface';
import {Option} from '../../../interfaces/option.inteface';
import {FieldComponent} from '../../field/field.component';

interface RadioData extends FieldData {
  options: Option[];
}

@Component({
  selector: 'jms-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent extends FieldComponent<RadioData> {}
