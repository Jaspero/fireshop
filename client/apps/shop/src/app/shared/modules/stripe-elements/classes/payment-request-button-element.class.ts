import {BehaviorSubject, from, Observable, of, throwError} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {ElementType} from '../enums/element-type.enum';
import {BaseElement} from './base-element.class';

export class PaymentRequestButtonElement extends BaseElement {
  type = ElementType.PaymentRequestButton;
  clientSecret: string;
  paymentRequest: stripe.paymentRequest.StripePaymentRequest;
  isValid$ = new BehaviorSubject(true);

  onMount() {
    return this.clientSecret$.pipe(
      tap(({clientSecret}) => {
        this.options = {
          ...this.options,
          paymentRequest: this.paymentRequest
        };

        this.paymentRequest.on('paymentmethod', ev => {
          this.stripe
            .confirmPaymentIntent(this.clientSecret, {
              payment_method: ev.paymentMethod.id
            })
            .then(confirmResult => {
              this.paymentTriggered.next(confirmResult);
            })
            .catch(error => this.paymentTriggered.next({error}));
        });

        this.clientSecret = clientSecret;
      })
    );
  }

  canCreate() {
    try {
      this.paymentRequest = this.stripe.paymentRequest(this.options);
    } catch (e) {
      return of(false);
    }

    return from(this.paymentRequest.canMakePayment()) as Observable<boolean>;
  }

  triggerPayment() {
    return from(
      this.stripe.handleCardPayment(
        this.clientSecret,
        this.element,
        this.paymentOptions
      )
    ).pipe(
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
