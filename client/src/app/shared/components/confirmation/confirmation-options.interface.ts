import {Color} from '../../enums/color.enum';

export interface ConfirmationOptions {
  confirm: string;
  negate: string;
  header: string;
  description?: string;
  color?: Color;
  variables?: any;
}
