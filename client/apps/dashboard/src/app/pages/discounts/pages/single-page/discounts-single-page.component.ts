import {Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import * as nanoid from 'nanoid';

export enum DiscountValueType {
  FixedAmount = 'fixedAmount',
  Percentage = 'percentage'
}

export enum LimitType {
  Limited = 'limited',
  Unlimited = 'unlimited'
}

@Component({
  selector: 'jfsc-discounts-single-page',
  templateUrl: './discounts-single-page.component.html',
  styleUrls: ['./discounts-single-page.component.scss']
})
export class DiscountsSinglePageComponent extends LangSinglePageComponent {
  collection = FirestoreCollections.Discounts;
  discountValueType = DiscountValueType;
  limitType = LimitType;

  public buildForm(data: any) {

    const startingDate = data.startingDate ? new Date(data.startingDate.seconds * 1000) : '';
    const endingDate = data.endingDate ? new Date(data.endingDate.seconds * 1000) : '';

    this.form = this.fb.group({
      id: [data.id || '', Validators.required],
      name: [data.name || '', Validators.required],
      description: [data.description || ''],
      valueType: [
        data.valueType || this.discountValueType.Percentage,
        Validators.required
      ],
      startingDate: [startingDate],
      endingDate: [endingDate],
      value: [data.value || ''],
      type: [data.type || ''],
      active: [true, Validators.required],
      limitedNumber: [data.limitedNumber || '']
    });
  }

  generate() {
    this.form.get('id').setValue(nanoid());
  }
}
