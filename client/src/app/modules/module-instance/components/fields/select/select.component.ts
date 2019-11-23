import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {WhereFilter} from '../../../../../shared/interfaces/where-filter.interface';
import {DbService} from '../../../../../shared/services/db/db.service';
import {FieldData} from '../../../interfaces/field-data.interface';
import {Option} from '../../../interfaces/option.inteface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent} from '../../field/field.component';

interface SelectData extends FieldData {
  dataSet?: Option[];
  multiple?: boolean;
  populate?: {
    collection: string;
    nameKey: string;
    valueKey?: string;
    orderBy?: string;
    filter?: WhereFilter
  };
  autocomplete?: string;
}

@Component({
  selector: 'jms-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent extends FieldComponent<SelectData>
  implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: SelectData,
    private dbService: DbService
  ) {
    super(cData);
  }

  dataSet$: Observable<Option[]>;
  loading$ = new BehaviorSubject(true);

  ngOnInit() {
    if (this.cData.populate) {
      this.dataSet$ = this.dbService
        .getDocumentsSimple(
          this.cData.populate.collection,
          this.cData.populate.orderBy,
          this.cData.populate.filter
        )
        .pipe(
          map(docs =>
            docs.map(doc => ({
              value: doc[this.cData.populate.valueKey || 'id'],
              name: doc[this.cData.populate.nameKey]
            }))
          ),
          tap(() => this.loading$.next(false))
        );
    } else {
      this.dataSet$ = of(this.cData.dataSet);
    }
  }
}
