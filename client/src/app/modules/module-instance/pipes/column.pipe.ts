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
import {safeEval} from '../utils/safe-eval';

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
      [PipeType.Sanitize]: new SanitizePipe(this.sanitizer),
      [PipeType.Custom]: ''
    };
  }

  pipes: {[key: string]: any};

  transform(value: any, pipeTypes: PipeType | PipeType[], allArgs: any[] | {[key: string]: any[]} = []): any {
    if (!pipeTypes) {
      return value;
    }

    if (Array.isArray(pipeTypes)) {
      return pipeTypes.reduce((acc, type, index) => this.executePipeTransform(type, acc, allArgs[index]), value);
    } else {
      return this.executePipeTransform(pipeTypes, value, allArgs);
    }
  }

  private executePipeTransform(type, val, args) {
    switch (type) {
      case PipeType.Date:
        if (!val) {
          return '';
        }

        try {
          const test = new Date(val);
        } catch (e) {
          return '';
        }

        break;
      case PipeType.Titlecase:
      case PipeType.Uppercase:
      case PipeType.Lowercase:
        if (typeof val !== 'string') {
          return '';
        }
        break;
      case PipeType.Number:
      case PipeType.Currency:
      case PipeType.Percent:
        if (typeof val !== 'number') {
          return '';
        }
        break;
      case PipeType.Custom:
        const method = safeEval(args);

        if (method && typeof method !== 'function') {
          return '';
        }

        return method(val);
    }

    return this.pipes[type].transform(val, ...(args || []));
  }
}
