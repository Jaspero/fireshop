import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface InputData extends FieldData {
  type: 'text' | 'number' | 'email';
}

@Component({
  selector: 'jms-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends FieldComponent<InputData> {}
