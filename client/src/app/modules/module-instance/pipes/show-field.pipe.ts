import {Pipe, PipeTransform} from '@angular/core';
import {CompiledField} from '../interfaces/compiled-field.interface';
import {Parser} from '../utils/parser';

@Pipe({
  name: 'showField'
})
export class ShowFieldPipe implements PipeTransform {
  transform(fields: CompiledField[], parser: Parser): CompiledField[] {
    return fields.filter(
      field => !field.onlyOn || field.onlyOn === parser.state
    );
  }
}
