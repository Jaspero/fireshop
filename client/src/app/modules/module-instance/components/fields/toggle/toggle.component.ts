import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldData} from '../../../interfaces/field-data.interface';
import {FieldComponent} from '../../field/field.component';

@Component({
  selector: 'jms-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent extends FieldComponent<FieldData> {}
