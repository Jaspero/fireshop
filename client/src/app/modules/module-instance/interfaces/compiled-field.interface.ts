import {ComponentPortal} from '@angular/cdk/portal';
import {FormControl} from '@angular/forms';
import {FieldComponent} from '../components/field/field.component';

export interface CompiledField {
  pointer: string;
  label: string;
  control: FormControl;
  portal: ComponentPortal<FieldComponent<any>>;
}
