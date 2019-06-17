import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface TextareaData extends FieldData {
  rows: number;
  cols: number;
}

@Component({
  selector: 'jms-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent extends FieldComponent<TextareaData> {}
