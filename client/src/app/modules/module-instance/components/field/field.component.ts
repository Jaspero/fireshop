import {Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {COMPONENT_DATA} from '../../utils/create-component-injector';

export interface FieldData {
  control: FormControl;
  label: string;
  hint?: string;
}

@Component({
  selector: 'jms-field',
  template: ''
})
export class FieldComponent<T extends FieldData> {
  constructor(@Inject(COMPONENT_DATA) public cData: T) {}
}
