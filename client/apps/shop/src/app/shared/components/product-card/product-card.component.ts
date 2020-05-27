import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';
import {Price, Product} from '@jf/interfaces/product.interface';
import {UNIQUE_ID, UNIQUE_ID_PROVIDER} from '@jf/utils/id.provider';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {filter, map, shareReplay} from 'rxjs/operators';
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

  price: Price;
  filters: any;
  wishList$: Observable<{
    icon: string;
    label: string;
  }>;
  cartQuantity$: Observable<number>;
  canAddToCart$: Observable<boolean>;

  selectedWish: boolean;

  sale$ = new BehaviorSubject<Sale>(null);

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
    private state: StateService
  ) {}

  ngOnInit() {
    if (this.product.sale) {
      this.state.sales$.subscribe((data: any) => {
        const sales = data.filter(sale => sale.id === this.product.sale);
        if (!sales.length) {
          return;
        }
        const sale = sales[0];
        if (
          !sale.active ||
          !(sale.startingDate.seconds < Date.now() < sale.endingDate.seconds)
        ) {
          return;
        }
        this.sale$.next(sale);

        for (const value of Object.keys(this.product.price)) {
          if (sale.fixed) {
            this.product.price[value] -= sale.values[value];
          } else {
            this.product.price[value] -=
              (this.product.price[value] / 100) * fromStripeFormat(sale.value);
          }

          this.product.price[value] = Math.max(this.product.price[value], 0);
        }
        this.price = this.product.price;
      });
    }

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

    this.price = price;
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
