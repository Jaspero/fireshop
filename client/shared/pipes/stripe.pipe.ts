import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';

@Pipe({name: 'sp'})
export class StripePipe implements PipeTransform {
  constructor() {
    this.currencyPipe = new CurrencyPipe(STATIC_CONFIG.lang);
  }

  currencyPipe: CurrencyPipe;

  transform(
    data: number | {[key: string]: number},
    currencyCode?: string,
    display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
    digitsInfo?: string,
    locale?: string
  ): string {

    const code = currencyCode || DYNAMIC_CONFIG.currency.primary;
    const value = typeof data === 'number' ? data : data.hasOwnProperty(code) ? data[code] : data[DYNAMIC_CONFIG.currency.primary] || 0;

    return this.currencyPipe.transform(
      value / 100,
      code,
      display,
      digitsInfo,
      locale
    );
  }
}
