import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {State, Parser, safeEval} from '@jaspero/form-builder';
import {FilterMethod} from '../../../../shared/enums/filter-method.enum';
import {FilterModule, FilterModuleDefinition} from '../../../../shared/interfaces/filter-module.interface';
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

  apply(form: FormGroup, parser: Parser, override?: any) {

    parser.preSaveHooks(
      State.Create,
      []
    );

    const data = override || form.getRawValue();
    let toSend: WhereFilter[] = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {

        const definition = ((this.data.definitions || {})[key] || {}) as FilterModuleDefinition;

        toSend.push({
          key,
          value: data[key],
          operator: definition.filterMethod || FilterMethod.Equal,
          ...definition.filterLabel && {label: definition.filterLabel},
          ...this.data.persist && {persist: this.data.persist}
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
