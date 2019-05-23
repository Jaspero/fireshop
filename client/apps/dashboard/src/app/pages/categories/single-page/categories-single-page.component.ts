import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LangSinglePageComponent} from '../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../shared/const/url-regex.const';

@Component({
  selector: 'jfsc-categories-single-page',
  templateUrl: './categories-single-page.component.html',
  styleUrls: ['./categories-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesSinglePageComponent extends LangSinglePageComponent {
  collection = FirestoreCollections.Categories;

  buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.currentState === this.viewState.Edit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      description: [data.description || '']
    });
  }
}
