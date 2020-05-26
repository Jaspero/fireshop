import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderByValue'
})
export class OrderByValuePipe implements PipeTransform {
  transform(array: Array<any>): Array<any> {
    if (!array || !array.length) return null;
    array.sort((a: any, b: any) => (a.value < b.value ? -1 : 1));

    return array;
  }
}
