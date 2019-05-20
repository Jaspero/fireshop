import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

@Component({
  selector: 'jms-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends FieldComponent<FieldData> {}
