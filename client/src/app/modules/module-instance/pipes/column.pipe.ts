import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {SanitizePipe} from '@jaspero/ng-helpers';
import {PipeType} from '../../../shared/enums/pipe-type.enum';
import {MathPipe} from '../../../shared/pipes/math/math-pipe.';

@Pipe({
  name: 'column'
})
export class ColumnPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    this.pipes = {
      [PipeType.Number]: new DecimalPipe('en'),
      [PipeType.Currency]: new CurrencyPipe('en'),
      [PipeType.Percent]: new PercentPipe('en'),
      [PipeType.Date]: new DatePipe('en'),
      [PipeType.Math]: new MathPipe(),
      [PipeType.Json]: new JsonPipe(),
      [PipeType.Lowercase]: new LowerCasePipe(),
      [PipeType.Uppercase]: new UpperCasePipe(),
      [PipeType.Titlecase]: new TitleCasePipe(),
      [PipeType.Sanitize]: new SanitizePipe(this.sanitizer)
    };
  }

  pipes: {[key: string]: any};

  transform(value: any, type?: PipeType, args?: any[]): any {
    if (!type) {
      return value;
    }

    switch (type) {
      case PipeType.Date:
        if (!value) {
          return '';
        }

        try {
          const test = new Date(value);
        } catch (e) {
          return '';
        }

        break;
      case PipeType.Titlecase:
      case PipeType.Uppercase:
      case PipeType.Lowercase:
        if (typeof value !== 'string') {
          return '';
        }
        break;
      case PipeType.Number:
      case PipeType.Currency:
      case PipeType.Percent:
        if (typeof value !== 'number') {
          return '';
        }
        break;
    }

    return this.pipes[type].transform(value, ...(args || []));
  }
}
