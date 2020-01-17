import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {WhereFilter} from '../../../../../shared/interfaces/where-filter.interface';
import {DbService} from '../../../../../shared/services/db/db.service';
import {FieldData} from '../../../interfaces/field-data.interface';
import {Option} from '../../../interfaces/option.inteface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {safeEval} from '../../../utils/safe-eval';
import {FieldComponent} from '../../field/field.component';

interface SelectData extends FieldData {
  dataSet?: Option[];
  multiple?: boolean;
  populate?: {
    collection?: string;
    nameKey?: string;
    valueKey?: string;
    orderBy?: string;

    /**
     * A method for mapping all of the results
     * (items: T[]) => any[]
     */
    mapResults?: string;

    /**
     * If a filter is a string
     * it represents the id of the document
     */
    filter?: WhereFilter | string;

    dependency?: {
      key: string;
      method: string;
    }
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

      const mapResults = this.cData.populate.mapResults ? safeEval(this.cData.populate.mapResults) : null;
      const documentsMethod = (
        query?: {
          collection: string,
          orderBy: string,
          filter: WhereFilter | string
        }
      ) => {

        this.loading$.next(true);

        if (!query) {
          this.loading$.next(false);
          return of([]);
        }

        if (query.filter && typeof query.filter === 'string') {
          return this.dbService.getDocument(
            query.collection,
            query.filter
          )
            .pipe(
              map(it => {
                return (mapResults ? mapResults(it) : [it]).map(doc => ({
                  value: doc[this.cData.populate.valueKey || 'id'],
                  name: doc[this.cData.populate.nameKey || 'name']
                }));
              }),
              tap(() => this.loading$.next(false))
            );
        }

        return this.dbService
          .getDocumentsSimple(
            query.collection,
            query.orderBy,
            query.filter as WhereFilter
          )
          .pipe(
            map(docs => {
              if (mapResults) {
                docs = mapResults(docs);
              }

              return docs.map(doc => ({
                value: doc[this.cData.populate.valueKey || 'id'],
                name: doc[this.cData.populate.nameKey || 'name']
              }));
            }),
            tap(() => this.loading$.next(false))
          );
      };

      if (this.cData.populate.dependency) {

        const pointer = this.cData.pointers[this.cData.populate.dependency.key];
        const gm = safeEval(this.cData.populate.dependency.method);

        this.dataSet$ = pointer.control.valueChanges
          .pipe(
            startWith(
              pointer.control.value
            ),
            switchMap(value =>
              documentsMethod(
                gm(value)
              )
            )
          );
      } else {
        this.dataSet$ = documentsMethod({
          collection: this.cData.populate.collection,
          orderBy: this.cData.populate.orderBy,
          filter: this.cData.populate.filter
        });
      }
    } else {
      this.dataSet$ = of(this.cData.dataSet);
    }
  }
}
