import {HttpClient} from '@angular/common/http';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {OrderItem, OrderPrice} from '@jf/interfaces/order.interface';
import {toStripeFormat} from '@jf/utils/stripe-format.ts';
import * as nanoid from 'nanoid';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  of,
  Subscription,
  throwError
} from 'rxjs';
import {
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {CartService} from '../../shared/services/cart/cart.service';
import {StateService} from '../../shared/services/state/state.service';

@Component({
  selector: 'jfs-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent extends RxDestroy implements OnInit {
  constructor(
    public cartService: CartService,
    private http: HttpClient,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router,
    private state: StateService
  ) {
    super();
  }

  @ViewChild('card')
  cardEl: ElementRef<HTMLElement>;

  stripe: {
    stripe: stripe.Stripe;
    cardObj: stripe.elements.Element;
    cardChanges$: Observable<stripe.elements.ElementChangeResponse>;
    clientSecret: string;
  };
  loading$ = new BehaviorSubject(false);
  billingInfo$: Observable<FormGroup>;
  price$: Observable<OrderPrice>;
  orderItems: OrderItem[];

  private shippingSubscription: Subscription;

  ngOnInit() {
    this.price$ = this.cartService.totalPrice$.pipe(
      map(total => {
        return {
          total,
          subTotal: total
        };
      })
    );

    this.billingInfo$ = this.afAuth.user.pipe(
      switchMap(user => {
        if (user) {
          return this.afs
            .doc(`${FirestoreCollections.Customers}/${user.uid}`)
            .valueChanges()
            .pipe(
              take(1),
              map(value => this.buildForm(value))
            );
        } else {
          return of(this.buildForm());
        }
      })
    );

    this.billingInfo$.pipe(take(1)).subscribe(() => {
      setTimeout(() => this.connectStripe());
    });
  }

  buildForm(value: any = {}) {
    const group = this.fb.group({
      billing: this.addressForm(value.billing ? value.billing : {}),
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
      email: [data.email || '', Validators.required],
      phone: [data.phone || '', Validators.required],
      city: [data.city || '', Validators.required],
      zip: [data.zip || '', Validators.required],
      country: [data.country || '', Validators.required],
      line1: [data.line1 || '', Validators.required],
      line2: [data.line2 || '']
    });
  }

  checkOut(data) {
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

    combineLatest(
      from(
        this.stripe['handleCardPayment'](
          this.stripe.clientSecret,
          this.stripe.cardObj,
          {
            payment_method_data: {
              billing_details: {
                name: `${data.billing.firstName} ${data.billing.lastName}`
              }
            }
          }
        )
      ),
      this.price$
    )
      .pipe(
        switchMap(([{paymentIntent, error}, prices]: [any, OrderPrice]) => {
          if (error) {
            return throwError(error);
          }

          const price = {...prices};

          for (let key in prices) {
            price[key] = toStripeFormat(price[key]);
          }

          return this.afs
            .collection(FirestoreCollections.Orders)
            .doc(nanoid())
            .set({
              price,
              status: OrderStatus.Ordered,
              paymentIntentId: paymentIntent.id,
              billing: data.billing,
              orderItems: this.orderItems,
              createdOn: Date.now(),
              ...(data.shippingInfo ? {shipping: data.shipping} : {}),
              ...(this.afAuth.auth.currentUser
                ? {
                    customerId: this.afAuth.auth.currentUser.uid,
                    customerName: this.afAuth.auth.currentUser.displayName,
                    email: this.afAuth.auth.currentUser.email
                  }
                : {})
            });
        }),
        finalize(() => this.loading$.next(false))
      )
      .subscribe(
        res => {
          this.router.navigate(['checkout/success']);
        },
        err => {
          this.router.navigate(['checkout/error']);
        }
      );
  }

  private connectStripe() {
    const str = Stripe(ENV_CONFIG.stripe.token);
    const elements = str.elements();
    const cardObj = elements.create('card', {style: {}});

    cardObj.mount(this.cardEl.nativeElement);

    const cardChanges$ = new Observable<stripe.elements.ElementChangeResponse>(
      obs => {
        cardObj.on('change', event => {
          obs.next(event);
        });
      }
    ).pipe(shareReplay(1));

    this.stripe = {
      stripe: str,
      cardObj,
      cardChanges$,
      clientSecret: ''
    };

    this.cartService.items$
      .pipe(
        take(1),
        switchMap(items => {
          this.orderItems = items.map(val => ({
            id: val.productId,
            quantity: val.quantity,

            /**
             * TODO: Connect attributes if necessary
             */
            attributes: {}
          }));

          return this.http.post<{clientSecret: string}>(
            `${environment.restApi}/stripe/checkout`,
            {
              orderItems: this.orderItems,
              lang: STATIC_CONFIG.lang
            }
          );
        })
      )
      .subscribe(res => {
        this.stripe.clientSecret = res.clientSecret;
      });
  }
}
