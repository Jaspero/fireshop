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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {CartService} from '../../shared/services/cart/cart.service';
import {StateService} from '../../shared/services/state/state.service';
import {WishListService} from '../../shared/services/wish-list/wish-list.service';

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
    quantity: number;
    wishList: {
      label: string;
      icon: string;
    };
    isDisabled: boolean;
  }>;
  similar$: Observable<any>;
  imgIndex = 0;
  filters: FormGroup;

  @ViewChild('reviewsDialog') reviewsDialog: TemplateRef<any>;

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

        if (data.product.attributes) {
          const fbGroup = data.product.attributes.reduce((acc, cur) => {
            acc[cur.key] = ['', Validators.required];
            return acc;
          }, {});
          this.filters = this.fb.group(fbGroup);
        } else {
          this.filters = null;
        }

        const toCombine = [
          this.cart.items$,
          this.wishList.includes(data.product.id)
        ];

        if (this.filters) {
          toCombine.push(
            this.filters.valueChanges.pipe(
              startWith(this.filters.getRawValue())
            )
          );
        }

        return combineLatest(...toCombine).pipe(
          map(([cartData, inWishList, filters]) => {
            let cart = cartData.find(c => data.product.id === c.identifier);
            let disabled = false;
            if (data.product.attributes) {
              if (this.filters.valid) {
                let statId = '';
                for (const key in filters) {
                  statId = statId
                    ? `${statId}_${filters[key]}`
                    : `${data.product.id}_${filters[key]}`;
                }
                cart = cartData.find(c => statId === c.identifier);
                if (cart) {
                  statId = statId.replace(`${data.product.id}_`, '');
                  disabled =
                    data.product.inventory[statId].quantity <= cart.quantity;
                }
              }
            }

            return {
              product: data.product as Product,
              quantity: cart ? cart.quantity : 0,
              isDisabled: disabled,
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

  disabledButton(val) {
    if (val.product.attributes) {
      if (this.filters.valid) {
        let statId = '';
        const object = this.filters.getRawValue();
        for (const key in object) {
          statId = statId ? `${statId}_${object[key]}` : `${object[key]}`;
        }
        return val.quantity >= val.product.inventory[statId].quantity;
      } else {
        return true;
      }
    } else {
      return val.quantity >= val.product.quantity;
    }
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
