import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
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
export class DateFieldComponent extends FieldComponent<DateData>
  implements OnInit {
  startDate: Date;

  ngOnInit() {
    this.startDate = this.cData.startAt
      ? new Date(this.cData.startAt)
      : new Date();
  }
}
