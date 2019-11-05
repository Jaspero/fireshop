import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterModule} from '../../../../shared/interfaces/filter-module.interface';
import {WhereFilter} from '../../../../shared/interfaces/where-filter.interface';

@Component({
  selector: 'jms-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: FilterModule,
    private dialogRef: MatDialogRef<FilterDialogComponent>
  ) {}

  apply(form: FormGroup) {

    const data = form.getRawValue();
    const toSend: WhereFilter[] = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        toSend.push({
          key,
          value: data[key],
          operator: '=='
        });
      }
    }

    this.dialogRef.close(toSend);
  }
}
