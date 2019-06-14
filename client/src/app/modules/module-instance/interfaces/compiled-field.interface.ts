import {ComponentPortal} from '@angular/cdk/portal';
import {FieldComponent} from '../components/field/field.component';
import {Control} from './control.type';

export interface CompiledField {
  pointer: string;
  label: string;
  placeholder: string;
  control: Control;
  portal: ComponentPortal<FieldComponent<any>>;
  validation: any;
}
