import {Color} from '../../../apps/shop/src/app/shared/enums/color.enum';

export interface ConfirmationOptions {
  confirm: string;
  negate: string;
  header: string;
  skipFilter?: boolean;
  skipSubscribe?: boolean;
  description?: string;
  color?: Color;
}
