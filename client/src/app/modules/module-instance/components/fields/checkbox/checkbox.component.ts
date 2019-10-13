import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FieldData} from '../../../interfaces/field-data.interface';
import {FieldComponent} from '../../field/field.component';

@Component({
  selector: 'jms-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends FieldComponent<FieldData> {}
