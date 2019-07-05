import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'math'
})
export class MathPipe implements PipeTransform {
  transform(value: number, ...args: any): any {
    const [type, ...additional] = args;

    if (additional) {
      return Math[type](value, ...additional);
    } else {
      return Math[type](value);
    }
  }
}
