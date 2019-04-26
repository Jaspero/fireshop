import {Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LangSinglePageComponent} from '../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../shared/const/url-regex.const';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'jfsc-categories-single-page',
  templateUrl: './categories-single-page.component.html',
  styleUrls: ['./categories-single-page.component.scss']
})
export class CategoriesSinglePageComponent extends LangSinglePageComponent {
  collection = FirestoreCollections.Categories;

  buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.isEdit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      description: [data.description || '']
    });

    this.initialValue = this.form.getRawValue();
    this.currentValue = this.form.getRawValue();

    this.form.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      this.currentValue = value;
    });
  }
}
