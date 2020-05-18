import {CardElement} from '../classes/card-element.class';
import {PaymentRequestButtonElement} from '../classes/payment-request-button-element.class';
import {ElementType} from '../enums/element-type.enum';

export const ELEMENTS_MAP = {
  [ElementType.Card]: CardElement,
  [ElementType.PaymentRequestButton]: PaymentRequestButtonElement
};
