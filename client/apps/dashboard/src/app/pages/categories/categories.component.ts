import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {LangListComponent} from '../../shared/components/lang-list/lang-list.component';

@Component({
  selector: 'jfsc-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent extends LangListComponent<Category> {
  collection = FirestoreCollections.Categories;
  displayedColumns = ['checkBox', 'id', 'name', 'actions'];
}
