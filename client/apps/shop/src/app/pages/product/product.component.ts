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
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Product} from '@jf/interfaces/product.interface';
import {Review} from '@jf/interfaces/review.interface';
import {combineLatest, Observable} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
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
    private http: HttpClient
  ) {
    super();
  }
  rews$: Observable<Review[]>;
  reviewsRating$: Observable<number>;
  data$: Observable<{
    product: Product;
    quantity: number;
    wishList: {
      label: string;
      icon: string;
    };
  }>;
  similar$: Observable<any>;
  imgIndex = 0;

  @ViewChild('reviewsDialog') reviewsDialog: TemplateRef<any>;

  ngOnInit() {
    this.data$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        return combineLatest(
          this.activatedRoute.data.pipe(
            tap(val => {
              this.similar$ = this.http.get(
                `${environment.restApi}/similarProducts`,
                {
                  params: {
                    category: val.product.category,
                    id: val.product.id,
                    num: '3',
                    lang: STATIC_CONFIG.lang
                  }
                }
              );
            })
          ),
          this.cart.items$,
          this.wishList.includes(params.id)
        ).pipe(
          map(([routeData, cartData, inWishList]) => {
            const cart = cartData.find(c => params.id === c.identifier);

            return {
              product: {
                id: params.id,
                ...routeData.product
              } as Product,
              quantity: cart ? cart.quantity : 0,
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
        map(actions =>
          actions.map(action => {
            const data = action.payload.doc.data();

            return {
              id: action.payload.doc.id,
              ...data
            };
          })
        )
      );

    this.reviewsRating$ = this.rews$.pipe(
      map(reviews => {
        return reviews.length;
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
