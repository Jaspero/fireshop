import {HttpClient} from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {OrderItem, OrderPrice} from '@jf/interfaces/order.interface';
import * as nanoid from 'nanoid';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  Subscription,
  throwError
} from 'rxjs';
import {
  finalize,
  first,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {
  LoginSignupDialogComponent,
  LoginSignUpView
} from '../../shared/components/login-signup-dialog/login-signup-dialog.component';
import {CartService} from '../../shared/services/cart/cart.service';
import {
  LoggedInUser,
  StateService
} from '../../shared/services/state/state.service';

interface CheckoutSate {
  price: OrderPrice;
  form: FormGroup;
  termsControl: FormControl;
  stripe: {
    stripe: stripe.Stripe;
    cardObj: stripe.elements.Element;
    cardChanges$: Observable<stripe.elements.ElementChangeResponse>;
    clientSecret: string;
  };
  orderItems: OrderItem[];
  user?: LoggedInUser;
}

function cardValidator(cardChanges$: CheckoutSate['stripe']['cardChanges$']) {
  return () =>
    cardChanges$.pipe(
      take(1),
      map(changes => {
        return !changes || !changes.complete ? {cardInvalid: true} : null;
      })
    );
}

@Component({
  selector: 'jfs-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent extends RxDestroy implements OnInit {
  constructor(
    public cartService: CartService,
    public afAuth: AngularFireAuth,
    private http: HttpClient,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private router: Router,
    private state: StateService,
    private dialog: MatDialog
  ) {
    super();
  }

  /**
   * Using ViewChildren instead of ViewChild so
   * we can observe changes and wait for the
   * element to become available in the DOM
   */
  @ViewChildren('card')
  cardHostEl: QueryList<ElementRef<HTMLElement>>;

  loading$ = new BehaviorSubject(false);
  data$: Observable<CheckoutSate>;

  private shippingSubscription: Subscription;

  ngOnInit() {
    this.data$ = combineLatest(
      this.cartService.totalPrice$.pipe(take(1)),

      this.cartService.items$.pipe(
        take(1),
        switchMap(items => {
          const orderItems = items.map(val => ({
            id: val.productId,
            quantity: val.quantity,
            price: val.price,
            name: val.name,

            /**
             * TODO: Connect attributes if necessary
             */
            attributes: {}
          }));

          return this.http
            .post<{clientSecret: string}>(
              `${environment.restApi}/stripe/checkout`,
              {
                orderItems,
                lang: STATIC_CONFIG.lang
              }
            )
            .pipe(map(({clientSecret}) => ({clientSecret, orderItems})));
        })
      ),

      this.state.user$
    ).pipe(
      map(([total, {clientSecret, orderItems}, user]) => {
        /**
         * Connect stripe
         */
        const str = Stripe(ENV_CONFIG.stripe.token);
        const elements = str.elements();
        const cardObj = elements.create('card', {
          style: {
            base: {
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px'
            }
          }
        });

        const cardChanges$ = new Observable<
          stripe.elements.ElementChangeResponse
        >(obs => {
          cardObj.on('change', event => {
            obs.next(event);
          });
        }).pipe(shareReplay(1));

        this.cardHostEl.changes
          .pipe(first(changes => changes.first))
          .subscribe(value => {
            cardObj.mount(value.first.nativeElement);
          });

        const form = this.buildForm(
          user ? user.customerData : {},
          cardChanges$
        );

        /**
         * Dirty solution for updating validity
         * when card element changes. This is
         * necessary because it isn't part of the
         * form
         */
        cardChanges$
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => form.updateValueAndValidity());

        return {
          /**
           * TODO: Incorporate tax and shipping
           */
          price: {
            total,
            subTotal: total
          },

          stripe: {
            stripe: str,
            cardObj,
            cardChanges$,
            clientSecret
          },

          orderItems,
          user,
          form,
          termsControl: new FormControl(false)
        };
      }),
      shareReplay(1)
    );
  }

  buildForm(value: Partial<Customer>, cardChanges$) {
    const group = this.fb.group(
      {
        billing: this.addressForm(value.billing ? value.billing : {}),
        shippingInfo: value.shippingInfo || true,
        saveInfo: true
      },
      {
        asyncValidators: [cardValidator(cardChanges$)]
      }
    );

    if (this.shippingSubscription) {
      this.shippingSubscription.unsubscribe();
    }

    this.shippingSubscription = group
      .get('shippingInfo')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(shippingInfo => {
        if (shippingInfo) {
          group.removeControl('shipping');
        } else {
          group.addControl('shipping', this.addressForm(value.shipping || {}));
        }
      });

    return group;
  }

  addressForm(data: any) {
    return this.fb.group({
      firstName: [data.firstName || '', Validators.required],
      lastName: [data.lastName || '', Validators.required],
      email: [data.email || '', Validators.required],
      phone: [data.phone || '', Validators.required],
      city: [data.city || '', Validators.required],
      zip: [data.zip || '', Validators.required],
      country: [data.country || '', Validators.required],
      line1: [data.line1 || '', Validators.required],
      line2: [data.line2 || '']
    });
  }

  checkOut(state: CheckoutSate, data: any) {
    if (data.saveInfo) {
      this.afs
        .doc(
          `${FirestoreCollections.Customers}/${
            this.afAuth.auth.currentUser.uid
          }`
        )
        .update(data);
    }

    this.loading$.next(true);

    from(
      state.stripe['handleCardPayment'](
        state.stripe.clientSecret,
        state.stripe.cardObj,
        {
          payment_method_data: {
            billing_details: {
              name: `${data.billing.firstName} ${data.billing.lastName}`
            }
          }
        }
      )
    )
      .pipe(
        switchMap(({paymentIntent, error}) => {
          if (error) {
            return throwError(error);
          }

          return this.afs
            .collection(FirestoreCollections.Orders)
            .doc(nanoid())
            .set({
              price: state.price,
              status: OrderStatus.Ordered,
              paymentIntentId: paymentIntent.id,
              billing: data.billing,
              orderItems: data.orderItems,
              createdOn: Date.now(),

              ...(data.shippingInfo ? {} : {shipping: data.shipping}),
              ...(state.user
                ? {
                    customerId: state.user.customerData.id,
                    customerName: state.user.customerData.name,
                    email: state.user.authData.email
                  }
                : {})
            });
        }),
        finalize(() => this.loading$.next(false))
      )
      .subscribe(
        () => {
          this.router.navigate(['checkout/success']);
        },
        () => {
          this.router.navigate(['checkout/error']);
        }
      );
  }

  logInSignUp(logIn = true) {
    this.dialog.open(LoginSignupDialogComponent, {
      width: '400px',
      data: {
        view: logIn ? LoginSignUpView.LogIn : LoginSignUpView.SignUp
      }
    });
  }
}
