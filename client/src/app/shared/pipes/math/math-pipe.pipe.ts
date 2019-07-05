import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'mathPipe'
})
export class MathPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return Math[args](value);
  }
}
