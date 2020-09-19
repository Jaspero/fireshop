import {Pipe, PipeTransform} from '@angular/core';
import {parseTemplate} from '@jaspero/form-builder';

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
