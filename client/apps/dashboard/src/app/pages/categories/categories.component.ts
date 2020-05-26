import {ChangeDetectionStrategy, Component} from '@angular/core';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {LangListComponent} from '../../shared/components/lang-list/lang-list.component';
import {SortDialogComponent} from '../../shared/components/sort-dialog/sort-dialog.component';

@Component({
  selector: 'jfsc-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent extends LangListComponent<Category> {
  collection = FirestoreCollections.Categories;
  displayedColumns = [
    'checkBox',
    'id',
    'createdOn',
    'name',
    'description',
    'actions'
  ];

  openSort() {
    this.dialog.open(SortDialogComponent, {
      width: '500px',
      data: {
        title: 'Category Sort',
        collection: `${FirestoreCollections.Categories}-${STATIC_CONFIG.lang}`
      }
    });
  }
}
