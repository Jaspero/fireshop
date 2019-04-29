import {Color} from '../../../apps/shop/src/app/shared/enums/color.enum';

export interface ConfirmationOptions {
  confirm: string;
  negate: string;
  header: string;
  description?: string;
  color?: Color;
}
