import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FieldData} from '../../../interfaces/field-data.interface';
import {FieldComponent} from '../../field/field.component';

interface TextareaData extends FieldData {
  rows?: number;
  cols?: number;
  autocomplete?: string;
}

@Component({
  selector: 'jms-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent extends FieldComponent<TextareaData> {}
