import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {Product} from '@jf/interfaces/product.interface';
import {from, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {LangListComponent} from '../../../../shared/components/lang-list/lang-list.component';
import {SortDialogComponent} from '../../../../shared/components/sort-dialog/sort-dialog.component';
import {MatCheckboxChange} from '@angular/material/checkbox';

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
    'createdOn',
    'name',
    'price',
    'active',
    'quantity',
    'actions'
  ];
  collection = FirestoreCollections.Products;
  additionalRouteData = {
    filters: {
      search: '',
      category: null,
      active: null
    }
  };
  categories$: Observable<Category[]>;

  @ViewChild('sortItem', {static: true})
  sortItemTemplate: TemplateRef<any>;

  ngOnInit() {
    super.ngOnInit();

    this.categories$ = this.afs
      .collection<Category>(
        `${FirestoreCollections.Categories}-${STATIC_CONFIG.lang}`
      )
      .valueChanges({idField: 'id'});
  }

  runFilters(ref) {
    if (this.options.filters.active !== null) {
      ref = ref.where(
        'active',
        FirebaseOperator.Equal,
        this.options.filters.active
      );
    }

    if (this.options.filters.category) {
      ref = ref.where(
        'category',
        FirebaseOperator.Equal,
        this.options.filters.category
      );
    }

    if (this.options.filters.search) {
      ref = ref.where(
        'search',
        FirebaseOperator.ArrayContains,
        this.options.filters.search
      );
    }

    return ref;
  }

  toggleActive(event: MatCheckboxChange, id: string) {
    this.state.language$
      .pipe(
        switchMap(lang =>
          from(
            this.afs
              .collection(`${FirestoreCollections.Products}-${lang}`)
              .doc(id)
              .set({active: event.checked}, {merge: true})
          )
        )
      )
      .subscribe();
  }

  openSort() {
    this.dialog.open(SortDialogComponent, {
      width: '800px',
      data: {
        title: 'Most Relevant Sort',
        collection: `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`,
        templateRef: this.sortItemTemplate
      }
    });
  }
}
