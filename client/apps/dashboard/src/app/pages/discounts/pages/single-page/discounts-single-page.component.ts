import {Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import * as nanoid from 'nanoid';

export enum DiscountValue {
  FixedAmount = 'Fixed amount',
  Percentage = 'Percentage'
}

export enum LimitType {
  Limited = 'Limited',
  Unlimited = 'Unlimited'
}

@Component({
  selector: 'jfsc-discounts-single-page',
  templateUrl: './discounts-single-page.component.html',
  styleUrls: ['./discounts-single-page.component.scss']
})
export class DiscountsSinglePageComponent extends LangSinglePageComponent {
  collection = FirestoreCollections.Discounts;
  value = DiscountValue;
  type = LimitType;

  public buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.currentState === this.viewState.Edit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      code: [data.code || '', Validators.required],
      description: [data.description || ''],
      discountValue: ['', Validators.required],
      startingDate: [data.startingDate || ''],
      endingDate: [data.endingDate || ''],
      value: [data.value || ''],
      type: [data.type || ''],
      active: [true, Validators.required],
      ribbonProduct: [data.ribbonProduct || true],
      limitedNumber: [data.limitedNumber || '']
    });
  }

  generate() {
    this.form.get('code').setValue(nanoid());
  }
}
