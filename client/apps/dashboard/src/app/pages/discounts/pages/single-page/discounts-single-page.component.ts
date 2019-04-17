import {Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';

@Component({
  selector: 'jfsc-discounts-single-page',
  templateUrl: './discounts-single-page.component.html',
  styleUrls: ['./discounts-single-page.component.scss']
})
export class DiscountsSinglePageComponent extends SinglePageComponent {
  collection = FirestoreCollections.Discounts;

  public buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.isEdit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      description: [data.description || '']
    });
  }
}
