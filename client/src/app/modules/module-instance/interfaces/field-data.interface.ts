import {FormControl} from '@angular/forms';

export interface FieldData {
  control: FormControl;
  label: string;
  hint?: string;
  placeholder?: string;
}
