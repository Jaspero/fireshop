import {Component, Inject} from '@angular/core';
import {FieldData} from '../../interfaces/field-data.interface';
import {COMPONENT_DATA} from '../../utils/create-component-injector';

@Component({
  selector: 'jms-field',
  template: ''
})
export class FieldComponent<T extends FieldData> {
  constructor(@Inject(COMPONENT_DATA) public cData: T) {}
}
