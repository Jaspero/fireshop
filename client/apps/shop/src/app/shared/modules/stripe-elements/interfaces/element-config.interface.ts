import {ElementType} from '../enums/element-type.enum';

export interface ElementConfig {
  type: ElementType;
  options?: any;
  paymentOptions?: stripe.HandleCardPaymentOptions;
}
