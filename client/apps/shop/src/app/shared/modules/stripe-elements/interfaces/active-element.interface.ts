import {Observable} from 'rxjs';
import {ElementType} from '../enums/element-type.enum';

export interface ActiveElement {
  type: ElementType;
  element: stripe.elements.Element;
  update?: (data: any) => void;

  /**
   * Exist on elements that trigger payment
   * (e.g. paymentRequestButton)
   */
  paymentTriggered$: Observable<any>;

  /**
   * Exist on elements that require the payment
   * to be triggered from the parent (e.g. card)
   */
  triggerPayment$: Observable<any>;
  isValid$?: Observable<boolean>;
}
