import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import * as nanoid from 'nanoid';
import {notify} from '@jf/utils/notify.operator';
import {tap} from 'rxjs/operators';
import {toStripeFormat} from '@jf/utils/stripe-format';
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
  // values = [10, 25, 50, 100, 200];

  buildForm(data) {
    console.log(this.objectCurrencies);
    console.log({
      value: DYNAMIC_CONFIG.currency.primary,
      symbol: this.objectCurrencies[DYNAMIC_CONFIG.currency.primary]
    });
    this.form = this.fb.group({
      id: [nanoid(), Validators.required],
      value: [data.value || '0', [Validators.required, Validators.min(0)]],
      currency: [
        data.currency || DYNAMIC_CONFIG.currency.primary,
        Validators.required
      ],
      values: [data.values || '{}']
    });
  }

  updateValues() {
    // console.log(this.form.get('currency').value);
    const lastInputValue = this.form.get('value').value;
    const lastCurrency = this.form.get('currency').value;
    // console.log('last currency', lastCurrency);
    const values = JSON.parse(this.form.get('values').value);

    values[lastCurrency] = lastInputValue;
    this.form.controls['values'].setValue(JSON.stringify(values));

    console.log(values);

    // this.form.controls['value'].setValue(values[])
    // console.log(lastInputValue, lastCurrency);
    // this.form.getRawValue()
    // this.form.controls['value'].setValue(this.form.get(''));
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
      const {id, ...item} = this.form.getRawValue();
      item.value = toStripeFormat(item.value);
      this.initialValue = this.form.getRawValue();
      delete this.initialValue.id;
      return this.getSaveData(id, item).pipe(
        notify(),
        tap(() => {
          this.back();
        })
      );
    };
  }
}
