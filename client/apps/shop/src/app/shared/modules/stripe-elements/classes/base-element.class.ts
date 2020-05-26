import {EventEmitter} from '@angular/core';
import {BehaviorSubject, from, Observable, of, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ElementType} from '../enums/element-type.enum';

export class BaseElement {
  constructor(
    public stripe: stripe.Stripe,
    public clientSecret$: Observable<{clientSecret: string}>,
    public paymentTriggered: EventEmitter<{
      error?: any;
      paymentIntent?: stripe.paymentIntents.PaymentIntent;
    }>,
    public options?: any,
    public paymentOptions?: stripe.HandleCardPaymentOptions
  ) {}

  element: stripe.elements.Element;
  type: ElementType;
  isValid$ = new BehaviorSubject(false);

  canCreate() {
    return of(true);
  }

  onMount(): Observable<any> {
    return of(true);
  }

  afterMount() {}

  triggerPayment(): Observable<any> {
    return this.clientSecret$.pipe(
      switchMap(({clientSecret}) =>
        from(
          this.stripe.handleCardPayment(
            clientSecret,
            this.element,
            this.paymentOptions
          )
        )
      ),
      switchMap(data => {
        if (data.error) {
          return throwError(data.error);
        } else {
          return of(data.paymentIntent);
        }
      })
    );
  }
}
