import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface SelectData extends FieldData {
  dataSet: Array<{name: string; value: string}>;
}

@Component({
  selector: 'jms-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent extends FieldComponent<SelectData> {}
