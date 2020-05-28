import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {CURRENCIES} from '../../../../shared/const/currency.const';
import {switchMap, take, tap} from 'rxjs/operators';
import {notify} from '@jf/utils/notify.operator';
import * as nanoid from 'nanoid';

@Component({
  selector: 'jfsc-sale-single-page',
  templateUrl: './sale-single-page.component.html',
  styleUrls: ['./sale-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleSinglePageComponent extends LangSinglePageComponent {
  collection = FirestoreCollections.Sales;

  currencies = CURRENCIES;
  objectCurrencies = this.convertCurrencies(this.currencies);

  public buildForm(data: any) {
    const startingDate = data.startingDate
      ? new Date(data.startingDate.seconds * 1000)
      : new Date();
    const endingDate = data.endingDate
      ? new Date(data.endingDate.seconds * 1000)
      : new Date();

    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.currentState === this.viewState.Edit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      description: [data.description || ''],
      fixed: [data.fixed || false, Validators.required],
      value: [fromStripeFormat(data.value) || '5', Validators.min(0)],
      startingDate: [startingDate, Validators.required],
      endingDate: [endingDate, Validators.required],
      limited: [data.limited || false],
      active: [data.active],
      showRibbon: [data.showRibbon],
      currency: [
        data.currency || DYNAMIC_CONFIG.currency.primary,
        Validators.required
      ],
      values: [data.values || '{}'],
      limitedNumber: [data.limitedNumber || '5']
    });

    this.form.get('currency').valueChanges.subscribe(currentCurrency => {
      const values = JSON.parse(this.form.controls['values'].value);
      this.form.controls['value'].setValue(
        fromStripeFormat(values[currentCurrency] || 0)
      );
    });
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
      return this.state.language$.pipe(
        take(1),
        switchMap(lang => this.getSaveData(id, item, lang)),
        notify(),
        tap(() => {
          this.back();
        })
      );
    };
  }

  limitless(value) {
    if (!value) {
      this.form.get('limitedNumber').reset();
    }
  }

  generate() {
    this.form.get('id').setValue(
      nanoid()
        .replace(/-/g, '')
        .replace(/_/g, '')
        .slice(0, 6)
        .toUpperCase()
    );
  }

  updateValues() {
    const lastInputValue = this.form.get('value').value;
    const lastCurrency = this.form.get('currency').value;
    const values =
      typeof this.form.get('values').value == 'object'
        ? this.form.get('values').value
        : JSON.parse(this.form.get('values').value);
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
}
