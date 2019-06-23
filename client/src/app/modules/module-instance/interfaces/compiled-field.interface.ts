import {ComponentPortal} from '@angular/cdk/portal';
import {FieldComponent} from '../components/field/field.component';
import {InstanceSingleState} from '../enums/instance-single-state.enum';
import {Control} from './control.type';

export interface CompiledField {
  pointer: string;
  control: Control;
  portal: ComponentPortal<FieldComponent<any>>;
  validation: any;

  /**
   * Properties pulled from definition
   * that are necessary in the view
   */
  placeholder: string;
  label: string;
  onlyOn?: InstanceSingleState;
}
