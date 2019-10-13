import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {DbService} from '../../../../../shared/services/db/db.service';
import {FieldData} from '../../../interfaces/field-data.interface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent} from '../../field/field.component';

interface AutocompleteData extends FieldData {
  dataSet: Array<{name: string; value: any}>;
  populate?: {
    collection: string;
    nameKey: string;
    valueKey?: string;
    orderBy?: string;
    filter?: {
      key: string;
      operator: string;
      value: any;
    };
  };
}

@Component({
  selector: 'jms-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends FieldComponent<AutocompleteData>
  implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: AutocompleteData,
    private dbService: DbService
  ) {
    super(cData);
  }

  filteredSet$: Observable<Array<{name: string; value: string}>>;
  loading$ = new BehaviorSubject(true);

  ngOnInit() {
    let dataSet$: Observable<Array<{name: string; value: string}>>;

    if (this.cData.populate) {
      dataSet$ = this.dbService
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
      dataSet$ = of(this.cData.dataSet);
    }

    this.filteredSet$ = dataSet$.pipe(
      switchMap(dataSet =>
        this.cData.control.valueChanges.pipe(
          startWith(this.cData.control.value),
          map(value => {
            if (!value) {
              return dataSet;
            }

            value = value.toLowerCase();

            return dataSet.filter(item =>
              item.name.toLowerCase().includes(value)
            );
          })
        )
      )
    );
  }
}
