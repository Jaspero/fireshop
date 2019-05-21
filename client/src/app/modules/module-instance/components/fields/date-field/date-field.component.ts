import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

interface DateData extends FieldData {
  startYear: number;
  startAt: number;
  touchUi: boolean;
}

@Component({
  selector: 'jms-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFieldComponent extends FieldComponent<DateData> {
  dateNow = Date.now();
}
