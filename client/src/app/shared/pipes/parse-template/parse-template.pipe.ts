import { Pipe, PipeTransform } from '@angular/core';
import {parseTemplate} from '../../utils/parse-template';

@Pipe({
  name: 'parseTemplate'
})
export class ParseTemplatePipe implements PipeTransform {

  transform(value: any, entry: string): string {
    return parseTemplate(
      entry,
      value,
    )
  }

}
