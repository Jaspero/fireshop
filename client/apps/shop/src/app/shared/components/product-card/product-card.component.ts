import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';
import {Product} from '@jf/interfaces/product.interface';
import {UNIQUE_ID, UNIQUE_ID_PROVIDER} from '@jf/utils/id.provider';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {CartService} from '../../services/cart/cart.service';
import {WishListService} from '../../services/wish-list/wish-list.service';

@Component({
  selector: 'jfs-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UNIQUE_ID_PROVIDER]
})
export class ProductCardComponent implements OnInit {
  constructor(
    @Inject(UNIQUE_ID)
    public uniqueId: string,
    public cart: CartService,
    public wishList: WishListService
  ) {}

  @Input()
  product: Product;

  wishList$: Observable<{
    icon: string;
    label: string;
  }>;

  cartQuantity$: Observable<any>;
  canAddToCart$: Observable<boolean>;

  ngOnInit() {
    this.wishList$ = this.wishList.includes(this.product.id).pipe(
      map(value =>
        value
          ? {
              label: 'Remove from wishlist',
              icon: 'favorite'
            }
          : {
              label: 'Add to wishlist',
              icon: 'favorite_bordered'
            }
      )
    );
    this.cartQuantity$ = this.cart.items$.pipe(
      map(items => {
        const index = items.findIndex(
          val => val.identifier === this.product.id
        );
        if (index !== -1) {
          return items[index].quantity;
        } else {
          return 0;
        }
      }),
      shareReplay(1)
    );

    this.canAddToCart$ = this.cartQuantity$.pipe(
      map(data => {
        return data < this.product.quantity;
      })
    );
  }
}
