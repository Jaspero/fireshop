import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatCheckboxChange} from '@angular/material';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Category} from '../../../../../../../shop/src/app/shared/interfaces/category.interface';
import {LangListComponent} from '../../../../shared/components/lang-list/lang-list.component';
import {Product} from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'jfsc-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent extends LangListComponent<Product>
  implements OnInit {
  displayedColumns = [
    'checkBox',
    'id',
    'name',
    'price',
    'active',
    'createdOn',
    'quantity',
    'actions'
  ];
  collection = FirestoreCollections.Products;
  categories$: Observable<Category[]>;

  ngOnInit() {
    super.ngOnInit();

    this.categories$ = this.afs
      .collection<Category>(`${this.collection}-${STATIC_CONFIG.lang}`)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => ({
            id: action.payload.doc.id,
            ...action.payload.doc.data()
          }))
        )
      );
  }

  runFilters(ref) {
    if (this.options.filters.category) {
      ref = ref.where(
        'category',
        FirebaseOperator.Equal,
        this.options.filters.category
      );
    }

    if (this.options.filters.search) {
      ref = ref.where(
        'name',
        FirebaseOperator.LargerThenOrEqual,
        this.options.filters.search
      );
    }

    return ref;
  }

  // TODO: Finish
  toggleActive(event: MatCheckboxChange) {
    console.log(event);
  }
}
