import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '@jf/enums/firestore-static-documents.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {Country} from '@jf/interfaces/country.interface';
import {Customer} from '@jf/interfaces/customer.interface';
import {OrderItem} from '@jf/interfaces/order.interface';
import {Shipping} from '@jf/interfaces/shipping.interface';
import * as nanoid from 'nanoid';
import {combineLatest, from, Observable, Subscription, throwError} from 'rxjs';
import {catchError, map, shareReplay, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {
  LoginSignupDialogComponent,
  LoginSignUpView
} from '../../shared/components/login-signup-dialog/login-signup-dialog.component';
import {ElementType} from '../../shared/modules/stripe-elements/enums/element-type.enum';
import {ElementConfig} from '../../shared/modules/stripe-elements/interfaces/element-config.interface';
import {StripeElementsComponent} from '../../shared/modules/stripe-elements/stripe-elements.component';
import {CartService} from '../../shared/services/cart/cart.service';
import {StateService} from '../../shared/services/state/state.service';

interface Item extends OrderItem {
  id: string,
  quantity: number,
  price: number,
  name: string,
  attributes: any,
  identifier: string
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
    public aff: AngularFireFunctions,
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

  clientSecret$: Observable<{clientSecret: string}>;
  countries$: Observable<Country[]>;
  form$: Observable<FormGroup>;
  loggedIn$: Observable<boolean>;
  items$: Observable<Item[]>;
  formData$: Observable<any>;
  shipping$: Observable<Shipping[]>;
  price$: Observable<{
    total: number,
    shipping: number,
    subTotal: number
  }>;
  elementConfig$: Observable<[ElementConfig, ElementConfig]>;

  termsControl = new FormControl(false);

  private shippingSubscription: Subscription;

  ngOnInit() {
    this.countries$ = from(
      this.aff.functions.httpsCallable('countries')()
    ).pipe(
      map(res => res.data),
      shareReplay(1)
    );

    this.shipping$ = this.afs.doc(`${FirestoreCollections.Settings}/${FirestoreStaticDocuments.Shipping}`).get()
      .pipe(
        map(res => res.exists ? res.data().value : []),
        shareReplay(1)
      );

    this.loggedIn$ = this.state.user$
      .pipe(
        map(user => !!user)
      );

    this.items$ = this.cartService.items$
      .pipe(
        map(items =>
          items.map(val => ({
            id: val.productId,
            quantity: val.quantity,
            price: val.price,
            name: val.name,
            attributes: val.filters,
            identifier: val.identifier
          }))
        )
      );

    this.form$ = this.state.user$
      .pipe(
        map(user => {
          return this.buildForm(user ? user.customerData : {})
        }),
        shareReplay(1)
      );

    this.formData$ = this.form$
      .pipe(
        map(form => form.getRawValue())
      );

    this.clientSecret$ = combineLatest([
      this.state.user$
        .pipe(
          take(1)
        ),
      this.formData$,
      this.items$
    ])
      .pipe(
        switchMap(([user, data, orderItems]) =>
          this.http.post<{clientSecret: string}>(
            `${environment.restApi}/stripe/checkout`,
            {
              orderItems,
              lang: STATIC_CONFIG.lang,
              form: data,
              ...user
              && {
                customer: {
                  email: user.authData.email,
                  name: user.customerData.name,
                  id: user.authData.uid
                }
              }
            }
          )
        ),
        shareReplay(1)
      );

    this.price$ = combineLatest([
      this.cartService.totalPrice$
        .pipe(
          take(1)
        ),
      this.formData$,
      this.shipping$
    ])
      .pipe(
        map(([cartTotal, data, shippingData]) => {
          const country = data.shippingInfo ? data.billing.country : data.shipping.country;
          const shipping = shippingData.hasOwnProperty(country) ? shippingData[country].value : DYNAMIC_CONFIG.currency.shippingCost || 0;
          const total = cartTotal + shipping;

          return {
            total,
            shipping,
            subTotal: total - shipping
          }
        })
      );

    this.elementConfig$ = combineLatest([
      this.price$,
      this.formData$
    ])
      .pipe(
        map(([price, data]) => [
          {
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
          },
          {
            type: ElementType.PaymentRequestButton,
            options: {
              currency: DYNAMIC_CONFIG.currency.primary.toLowerCase(),
              country: data.billing.country,
              total: {
                label: 'Total',
                amount: price.total
              }
            }
          }
        ])
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

  /**
   * Payments Triggered by clicking on checkout
   */
  checkOut() {
    return () =>
      this.stripeElementsComponent.activeElement
        .triggerPayment()
        .pipe(
          switchMap(paymentIntent => this.triggerPayment(paymentIntent))
        );
  }

  /**
   * Payments triggered by different payment methods
   * like apple pay for example
   */
  paymentTriggered(ev) {
    if (!ev.error) {
      this.triggerPayment(ev.paymentIntent)
        .pipe(
          take(1)
        )
        .subscribe();
    }
  }

  triggerPayment(paymentIntent) {
    return combineLatest([
      this.formData$,
      this.state.user$,
      this.price$,
      this.items$
    ])
      .pipe(
        switchMap(([data, user, price, items]) => {

          if (this.afAuth.auth.currentUser && data.saveInfo) {
            this.afs
              .doc(
                `${FirestoreCollections.Customers}/${this.afAuth.auth.currentUser.uid}`
              )
              .update(data);
          }

          return from(
            this.afs
              .collection(FirestoreCollections.Orders)
              .doc(nanoid())
              .set({
                price,
                status: OrderStatus.Ordered,
                paymentIntentId: paymentIntent.id,
                billing: data.billing,
                createdOn: Date.now(),

                ...(data.shippingInfo ? {} : {shipping: data.shipping}),
                ...user && user.authData
                && {
                  customerId: user.authData.uid,
                  customerName: user.customerData.name,
                  email: user.authData.email
                },

                /**
                 * Format ExtendedOrderItem[] in to the
                 * appropriate order format
                 */
                ...items.reduce(
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
          )
            .pipe(
              tap(() => {
                localStorage.setItem(
                  'result',
                  JSON.stringify({
                    orderItems: items,
                    price: price,
                    billing: data.billing,
                    ...(data.shippingInfo ? {} : {shipping: data.shipping.email})
                  })
                );
                this.router.navigate(['checkout/success']);
              }),
              catchError(error => {
                this.router.navigate(['checkout/error']);
                return throwError(error)
              })
            )
        })
      )
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
