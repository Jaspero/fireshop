import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {BehaviorSubject, from, Observable, throwError} from 'rxjs';
import {finalize, shareReplay, switchMap, take} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {CartService} from '../../shared/services/cart/cart.service';
import * as nanoid from 'nanoid';

@Component({
  selector: 'jfs-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements AfterViewInit {
  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  @ViewChild('card')
  cardEl: ElementRef<HTMLElement>;
  stripe: {
    stripe: stripe.Stripe;
    cardObj: stripe.elements.Element;
    cardChanges$: Observable<stripe.elements.ElementChangeResponse>;
    clientSecret: string;
  };
  loading$ = new BehaviorSubject(false);

  ngAfterViewInit() {
    this.connectStripe();
  }

  checkOut() {
    this.loading$.next(true);

    from(
      this.stripe['handleCardPayment'](
        this.stripe.clientSecret,
        this.stripe.cardObj,
        {
          payment_method_data: {
            // TODO: Add input for collecting this
            billing_details: {name: 'Test'}
          }
        }
      )
    )
      .pipe(
        switchMap(({paymentIntent, error}) => {
          if (error) {
            return throwError(error);
          }

          return (
            this.afs
              .collection(FirestoreCollections.Orders)
              .doc(nanoid())

              // TODO: Save other data
              .set({
                paymentIntentId: paymentIntent.id,
                customerId: this.afAuth.auth.currentUser.uid,
                customerName: this.afAuth.auth.currentUser.displayName,
                time: Date.now()
              })
          );
        }),
        finalize(() => this.loading$.next(false))
      )

      // TODO: Redirect to success/handle error
      .subscribe(res => {}, err => {});
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
          const orderItems = items.map(val => ({
            id: val.productId,
            quantity: val.quantity
          }));

          return this.http.post<{clientSecret: string}>(
            `${environment.restApi}/stripe/checkout`,
            {
              orderItems,
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
