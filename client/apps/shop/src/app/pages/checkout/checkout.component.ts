import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {OrderItem, OrderPrice} from '@jf/interfaces/order.interface';
import * as nanoid from 'nanoid';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
  throwError
} from 'rxjs';
import {
  catchError,
  finalize,
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
import {ElementType} from '../../shared/modules/stripe-elements/enums/element-type.enum';
import {ElementConfig} from '../../shared/modules/stripe-elements/interfaces/element-config.interface';
import {StripeElementsComponent} from '../../shared/modules/stripe-elements/stripe-elements.component';
import {CartService} from '../../shared/services/cart/cart.service';
import {
  LoggedInUser,
  StateService
} from '../../shared/services/state/state.service';

interface OrderItemWithId extends OrderItem {
  id: string;
}

interface CheckoutState {
  price: OrderPrice;
  form: FormGroup;
  termsControl: FormControl;
  orderItems: OrderItemWithId[];
  user?: LoggedInUser;
}

@Component({
  selector: 'jfs-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  @ViewChild(StripeElementsComponent, {static: false})
  stripeElementsComponent: StripeElementsComponent;

  pageLoading$ = new BehaviorSubject(true);
  checkoutLoading$ = new BehaviorSubject(false);
  data$: Observable<CheckoutState>;
  cardConfig: ElementConfig = {
    type: ElementType.Card,
    options: {
      style: {
        base: {
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px'
        }
      }
    }
  };
  payButtonConfig: ElementConfig = {
    type: ElementType.PaymentRequestButton
  };
  clientSecret$: Observable<{clientSecret: string}>;

  private shippingSubscription: Subscription;

  ngOnInit() {
    this.data$ = this.state.user$.pipe(
      switchMap(user =>
        combineLatest([
          this.cartService.totalPrice$.pipe(take(1)),

          this.cartService.items$.pipe(
            take(1),
            map(items => {
              const orderItems = items.map(val => ({
                id: val.productId,
                quantity: val.quantity,
                price: val.price,
                name: val.name,
                attributes: val.filters,
                identifier: val.identifier
              }));

              this.clientSecret$ = this.http.post<{clientSecret: string}>(
                `${environment.restApi}/stripe/checkout`,
                {
                  orderItems,
                  lang: STATIC_CONFIG.lang,
                  ...(user
                    ? {
                        customer: {
                          email: user.authData.email,
                          name: user.customerData.name,
                          id: user.authData.uid
                        }
                      }
                    : {})
                }
              );

              return orderItems;
            })
          )
        ]).pipe(
          map(([total, orderItems]) => {
            this.payButtonConfig.options = {
              currency: DYNAMIC_CONFIG.currency.primary,
              total: {
                label: 'Total',
                amount: total
              }
            };

            const form = this.buildForm(user ? user.customerData : {});

            this.pageLoading$.next(false);

            return {
              /**
               * TODO: Incorporate tax
               */
              price: {
                total,
                shipping: DYNAMIC_CONFIG.currency.shippingCost || 0,
                subTotal: total - (DYNAMIC_CONFIG.currency.shippingCost || 0)
              },

              orderItems,
              user,
              form,
              termsControl: new FormControl(false)
            };
          }),
          catchError(error => {
            localStorage.setItem('result', JSON.stringify(error.error));
            this.router.navigate(['/checkout/error']);

            return throwError(error);
          })
        )
      ),
      shareReplay(1)
    );
  }

  buildForm(value: Partial<Customer>) {
    const group = this.fb.group({
      billing: this.addressForm(value.billing ? value.billing : {}),
      code: '',
      shippingInfo: value.shippingInfo || true,
      saveInfo: true
    });

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
      email: [data.email || '', [Validators.required, Validators.email]],
      phone: [data.phone || '', Validators.required],
      city: [data.city || '', Validators.required],
      zip: [data.zip || '', Validators.required],
      country: [data.country || '', Validators.required],
      line1: [data.line1 || '', Validators.required],
      line2: [data.line2 || '']
    });
  }

  checkOut(state: CheckoutState, data: any) {
    this.checkoutLoading$.next(true);

    if (this.afAuth.auth.currentUser && data.saveInfo) {
      this.afs
        .doc(
          `${FirestoreCollections.Customers}/${this.afAuth.auth.currentUser.uid}`
        )
        .update(data);
    }

    this.stripeElementsComponent.activeElement
      .triggerPayment()
      .pipe(
        switchMap(paymentIntent =>
          this.afs
            .collection(FirestoreCollections.Orders)
            .doc(nanoid())
            .set({
              price: state.price,
              status: OrderStatus.Ordered,
              paymentIntentId: paymentIntent.id,
              billing: data.billing,
              createdOn: Date.now(),

              ...(data.shippingInfo ? {} : {shipping: data.shipping}),
              ...(state.user
                ? {
                    customerId: state.user.authData.uid,
                    customerName: state.user.customerData.name,
                    email: state.user.authData.email
                  }
                : {}),

              /**
               * Format ExtendedOrderItem[] in to the
               * appropriate order format
               */
              ...state.orderItems.reduce(
                (acc, cur) => {
                  const {id, ...data} = cur;

                  if (!data.attributes) {
                    delete data.attributes;
                  }

                  acc.orderItems.push(cur.id);
                  acc.orderItemsData.push(data);

                  return acc;
                },
                {
                  orderItems: [],
                  orderItemsData: []
                }
              )
            })
        ),
        finalize(() => this.checkoutLoading$.next(false))
      )
      .subscribe(
        () => {
          localStorage.setItem(
            'result',
            JSON.stringify({
              orderItems: state.orderItems,
              price: state.price,
              billing: data.billing,
              ...(data.shippingInfo ? {} : {shipping: data.shipping.email})
            })
          );
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
