import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface DateData extends FieldData {
  attribute: 'touchUi';
}

@Component({
  selector: 'jms-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFieldComponent extends FieldComponent<DateData> {
  startDate = new Date(1995, 0, 1);
}
