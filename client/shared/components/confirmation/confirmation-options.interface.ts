import {Color} from '@jf/enums/color.enum';

export interface ConfirmationOptions {
  confirm: string;
  negate: string;
  header: string;
  description?: string;
  color?: Color;
}
