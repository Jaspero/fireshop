import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent, FieldData} from '../../field/field.component';

interface SelectData extends FieldData {
  dataSet: Array<{name: string; value: string}>;
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
  selector: 'jms-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent extends FieldComponent<SelectData>
  implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: SelectData,
    private afs: AngularFirestore
  ) {
    super(cData);
  }

  dataSet$: Observable<Array<{name: string; value: string}>>;
  loading$ = new BehaviorSubject(true);

  ngOnInit() {
    if (this.cData.populate) {
      this.dataSet$ = this.afs
        .collection(this.cData.populate.collection, (ref: any) => {
          if (this.cData.populate.orderBy) {
            ref = ref.orderBy(this.cData.populate.orderBy);
          }

          if (this.cData.populate.filter) {
            ref = ref.where(
              this.cData.populate.filter.key,
              this.cData.populate.filter.operator,
              this.cData.populate.filter.value
            );
          }

          return ref;
        })
        .valueChanges({idField: 'id'})
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
