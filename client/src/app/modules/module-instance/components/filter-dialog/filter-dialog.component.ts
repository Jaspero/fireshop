import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterMethod} from '../../../../shared/enums/filter-method.enum';
import {ViewState} from '../../../../shared/enums/view-state.enum';
import {FilterModule, FilterModuleDefinition} from '../../../../shared/interfaces/filter-module.interface';
import {WhereFilter} from '../../../../shared/interfaces/where-filter.interface';
import {Parser} from '../../utils/parser';
import {safeEval} from '../../utils/safe-eval';

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

  apply(form: FormGroup, parser: Parser, override?: any) {

    parser.processHooks(
      ViewState.New,
      []
    );

    const data = override || form.getRawValue();
    let toSend: WhereFilter[] = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        toSend.push({
          key,
          value: data[key],
          operator: (
            (
              (this.data.definitions || {})[key] || {}
            ) as FilterModuleDefinition
          ).filterMethod || FilterMethod.Equal
        });
      }
    }

    if (this.data.formatOnSubmit) {
      const formatOnSubmit = safeEval(this.data.formatOnSubmit);

      if (formatOnSubmit) {
        toSend = formatOnSubmit(toSend);
      }
    }

    this.dialogRef.close(toSend);
  }
}
