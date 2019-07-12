import {DatePipe} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {FormControl} from '@angular/forms';
import {of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {StateService} from '../../../../../shared/services/state/state.service';
import {cloneAbstractControl} from '../../../../../shared/utils/clone-abstract-control';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent, FieldData} from '../../field/field.component';

interface DateData extends FieldData {
  startYear?: number;
  startAt?: number;
  touchUi?: boolean;
  startView?: 'month' | 'year' | 'multi-year';
  format?: 'number' | string;
}

@Component({
  selector: 'jms-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFieldComponent extends FieldComponent<DateData>
  implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: DateData,
    private storage: AngularFireStorage,
    private cdr: ChangeDetectorRef,
    private state: StateService
  ) {
    super(cData);
  }

  startDate: Date;
  entryControl: FormControl;

  ngOnInit() {
    this.state.saveComponents.push(this);
    this.startDate = this.cData.startAt
      ? new Date(this.cData.startAt)
      : new Date();
    this.entryControl = cloneAbstractControl(this.cData.control);

    /**
     * Dirty hack for getting numbers to display properly might need revisiting
     */
    if (
      typeof this.entryControl.value === 'number' ||
      typeof this.entryControl.value === 'string'
    ) {
      this.entryControl.setValue(new Date(this.entryControl.value));
    }
  }

  save() {
    return of({}).pipe(
      tap(() => {
        let value = this.entryControl.value;

        if (this.cData.format) {
          if (this.cData.format === 'number') {
            value = value.getTime();
          } else {
            const pipe = new DatePipe('en');

            value = pipe.transform(value, this.cData.format);
          }
        }

        this.cData.control.setValue(value);
      })
    );
  }
}
