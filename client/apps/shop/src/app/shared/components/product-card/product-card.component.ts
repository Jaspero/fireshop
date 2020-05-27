import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';
import {Price, Product} from '@jf/interfaces/product.interface';
import {UNIQUE_ID, UNIQUE_ID_PROVIDER} from '@jf/utils/id.provider';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {CartService} from '../../services/cart/cart.service';
import {WishListService} from '../../services/wish-list/wish-list.service';
import {getProductFilters} from '../../utils/get-product-filters';
import {OnChange} from '@jaspero/ng-helpers';
import {StateService} from '../../services/state/state.service';
import {Sale} from '@jf/interfaces/sales.interface';
import {fromStripeFormat} from '@jf/utils/stripe-format';

@Component({
  selector: 'jfs-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UNIQUE_ID_PROVIDER]
})
export class ProductCardComponent implements OnInit {
  @OnChange(function() {
    this.connectProperties();
  })
  @Input()
  product: Product;

  price$ = new BehaviorSubject<Price>(null);
  filters: any;
  wishList$: Observable<{
    icon: string;
    label: string;
  }>;
  cartQuantity$: Observable<number>;
  canAddToCart$: Observable<boolean>;

  selectedWish: boolean;

  sale$: Observable<Sale>;

  iconObject = {
    true: {
      label: 'Remove from wishlist',
      icon: 'favorite'
    },
    false: {
      label: 'Add to wishlist',
      icon: 'favorite_bordered'
    }
  };

  constructor(
    @Inject(UNIQUE_ID)
    public uniqueId: string,
    public cart: CartService,
    public wishList: WishListService,
    private state: StateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.wishList$ = this.wishList.includes(this.product.id).pipe(
      map(value => {
        this.selectedWish = value;
        return this.iconObject[value ? 'true' : 'false'];
      })
    );
    this.connectProperties();
  }

  toggleWish() {
    this.selectedWish = !this.selectedWish;
    this.wishList$ = of<any>(
      this.iconObject[this.selectedWish ? 'true' : 'false']
    );
    this.wishList.toggle(this.product);
  }

  connectProperties() {
    let identifier = this.product.id;
    let price = this.product.price;
    let quantity = this.product.quantity;
    let filters = {};

    if (this.product.attributes) {
      identifier = `${this.product.id}_${this.product.default}`;
      price = this.product.inventory[this.product.default].price;
      quantity = this.product.inventory[this.product.default].quantity;
      filters = getProductFilters(this.product, false);
    }

    if (this.product.sale) {
      this.sale$ = this.state.sales$.pipe(
        switchMap(data => {
          const sales = data.filter(sale => sale.id === this.product.sale);
          if (!sales.length) {
            return of(null);
          }

          const sale = sales[0];
          if (
            !sale.active ||
            !(sale.startingDate.seconds < Date.now() < sale.endingDate.seconds)
          ) {
            return of(null);
          }
          return of(sales[0]);
        }),
        tap(sale => {
          if (!sale) {
            return;
          }

          for (const value of Object.keys(price)) {
            if (sale.fixed) {
              price[value] -= sale.values[value] || 0;
            } else {
              price[value] -=
                (price[value] / 100) * fromStripeFormat(sale.value);
            }
            price[value] = Math.max(price[value], 0);
          }
          this.price$.next(price);
        })
      );
    } else {
      this.price$.next(price);
    }

    this.filters = filters;
    this.cartQuantity$ = this.cart.items$.pipe(
      map(items => {
        const index = items.findIndex(val => val.identifier === identifier);
        if (index !== -1) {
          return items[index].quantity;
        } else {
          return 0;
        }
      }),
      shareReplay(1)
    );

    this.canAddToCart$ = this.cartQuantity$.pipe(
      map(inCart => {
        if (this.product.allowOutOfQuantityPurchase) {
          return true;
        } else {
          return inCart < quantity;
        }
      })
    );
  }
}
