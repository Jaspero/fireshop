import {FormControl} from '@angular/forms';
import {Pointers} from '../utils/parser';

export interface FieldData {

  /**
   * Is the field rendered as part of a form
   * or in standalone "single" mode
   */
  single: boolean;
  pointers: Pointers;
  control: FormControl;
  label: string;
  hint?: string;
  placeholder?: string;
}
