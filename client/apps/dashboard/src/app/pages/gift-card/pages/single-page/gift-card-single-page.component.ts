import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import * as nanoid from 'nanoid';
import {notify} from '@jf/utils/notify.operator';
import {tap} from 'rxjs/operators';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format';
import {CURRENCIES} from '../../../../shared/const/currency.const';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';

@Component({
  selector: 'jfsc-gift-card-single-page',
  templateUrl: './gift-card-single-page.component.html',
  styleUrls: ['./gift-card-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardSinglePageComponent extends SinglePageComponent {
  collection = FirestoreCollections.GiftCards;
  currencies = CURRENCIES;
  objectCurrencies = this.convertCurrencies(this.currencies);

  buildForm(data) {
    this.form = this.fb.group({
      id: [nanoid(), Validators.required],
      value: [data.value || '0', [Validators.required, Validators.min(0)]],
      currency: [
        data.currency || DYNAMIC_CONFIG.currency.primary,
        Validators.required
      ],
      values: [data.values || '{}']
    });

    this.form.get('currency').valueChanges.subscribe(currentCurrency => {
      const values = JSON.parse(this.form.controls['values'].value);
      this.form.controls['value'].setValue(
        fromStripeFormat(values[currentCurrency] || 0)
      );
    });
  }

  updateValues() {
    const lastInputValue = this.form.get('value').value;
    const lastCurrency = this.form.get('currency').value;
    const values = JSON.parse(this.form.get('values').value);

    values[lastCurrency] = toStripeFormat(lastInputValue);
    this.form.controls['values'].setValue(JSON.stringify(values));
  }

  convertCurrencies(arr: any[]) {
    let result = {};
    for (let i = 0; i < arr.length; i++) {
      result[arr[i].value] = arr[i].symbol;
    }

    return result;
  }

  save() {
    return () => {
      this.updateValues();
      const {id, ...item} = this.form.getRawValue();
      item.values = JSON.parse(item.values);

      item.value = toStripeFormat(item.value);
      this.initialValue = this.form.getRawValue();
      delete this.initialValue.id;
      delete item.currency;
      return this.getSaveData(id, item).pipe(
        notify(),
        tap(() => {
          this.back();
        })
      );
    };
  }
}
