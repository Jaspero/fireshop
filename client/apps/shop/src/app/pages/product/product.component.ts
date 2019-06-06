import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Product} from '@jf/interfaces/product.interface';
import {Review} from '@jf/interfaces/review.interface';
import {combineLatest, Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {CartItem} from '../../shared/interfaces/cart-item.interface';
import {CartService} from '../../shared/services/cart/cart.service';
import {StateService} from '../../shared/services/state/state.service';
import {WishListService} from '../../shared/services/wish-list/wish-list.service';
import {getProductFilters} from '../../shared/utils/get-product-filters';

@Component({
  selector: 'jfs-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent extends RxDestroy implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    public cart: CartService,
    public wishList: WishListService,
    public dialog: MatDialog,
    private afs: AngularFirestore,
    private state: StateService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    super();
  }

  rews$: Observable<[Review[], number]>;
  data$: Observable<{
    product: Product;
    itemsInCart: number;
    quantity: number;
    price: number;
    wishList: {
      label: string;
      tooltip: string;
      icon: string;
    };
    isDisabled: boolean;
  }>;
  similar$: Observable<any>;
  imgIndex = 0;
  filters: FormGroup;

  @ViewChild('reviewsDialog', {static: true}) reviewsDialog: TemplateRef<any>;

  ngOnInit() {
    this.data$ = this.activatedRoute.data.pipe(
      switchMap(data => {
        this.similar$ = this.http.get(
          `${environment.restApi}/similarProducts`,
          {
            params: {
              category: data.product.category,
              id: data.product.id,
              num: '3',
              lang: STATIC_CONFIG.lang
            }
          }
        );

        const toCombine = [
          this.cart.items$,
          this.wishList.includes(data.product.id)
        ];

        if (data.product.attributes) {
          this.filters = this.fb.group(getProductFilters(data.product));

          toCombine.push(
            this.filters.valueChanges.pipe(
              startWith(this.filters.getRawValue())
            )
          );
        } else {
          this.filters = null;
        }

        return combineLatest(toCombine).pipe(
          map(([cartData, inWishList, filters]: [CartItem[], boolean, any]) => {
            let cart: CartItem;
            let price = data.product.price;
            let quantity = data.product.quantity;

            if (data.product.attributes) {
              if (this.filters.valid) {
                let statId = '';

                for (const key in filters) {
                  statId = statId
                    ? `${statId}_${filters[key]}`
                    : `${data.product.id}_${filters[key]}`;
                }

                cart = cartData.find(c => statId === c.identifier);
                statId = statId.replace(`${data.product.id}_`, '');
                price = data.product.inventory[statId].price;
                quantity = data.product.inventory[statId].quantity;
              }
            } else {
              cart = cartData.find(c => data.product.id === c.identifier);
            }

            if (cart) {
              quantity -= cart.quantity;
            }

            return {
              quantity,
              price,
              itemsInCart: cart ? cart.quantity : 0,
              isDisabled: data.product.allowOutOfQuantityPurchase
                ? false
                : quantity <= 0,
              product: data.product as Product,
              wishList: inWishList
                ? {
                    label: 'Already on wishlist',
                    tooltip: 'Remove from wishlist',
                    icon: 'favorite'
                  }
                : {
                    label: 'Add to wishlist',
                    tooltip: 'Add to wishlist',
                    icon: 'favorite_bordered'
                  }
            };
          })
        );
      })
    );

    this.rews$ = this.afs
      .collection<Review>(FirestoreCollections.Reviews, ref =>
        ref.where(
          'productId',
          FirebaseOperator.Equal,
          this.activatedRoute.snapshot.data.product.id
        )
      )
      .snapshotChanges()
      .pipe(
        map(res => {
          let avgRating = 0;
          const allReviews = res
            .map(action => {
              const data = action.payload.doc.data();
              avgRating += data.rating;
              return {
                id: action.payload.doc.id,
                ...data
              };
            })
            .sort(a => {
              if (this.afAuth.auth.currentUser) {
                return a.customerId === this.afAuth.auth.currentUser.uid
                  ? -1
                  : 1;
              } else {
                return -1;
              }
            });

          avgRating = avgRating / res.length;
          return [allReviews, avgRating] as [Review[], number];
        })
      );
  }

  openReviews() {
    this.dialog.open(this.reviewsDialog, {
      width: '600px'
    });
  }

  changePicture(index) {
    this.imgIndex = index;
  }

  facebookShare(data) {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${
        environment.websiteUrl
      }/product/${data.product.id}`,
      'facebook-popup',
      'height=350,width=600'
    );
  }

  twitterShare(data) {
    window.open(
      `http://twitter.com/share?text=${data.product.name}&url=${
        environment.websiteUrl
      }/product/${data.product.id}`,
      '',
      'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
    );
  }

  emailShare(data) {
    window.location.href = `mailto:test@example.com?subject=${
      data.product.name
    }&body=${environment.websiteUrl}/product/${data.product.id}`;
  }
}
