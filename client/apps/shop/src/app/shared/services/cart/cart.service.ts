import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {BROWSER_CONFIG} from '@jf/consts/browser-config.const';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {Price, Product} from '@jf/interfaces/product.interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {CartItem} from '../../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private snackBar: MatSnackBar) {
    const cart = BROWSER_CONFIG.isBrowser
      ? JSON.parse(localStorage.getItem('cartItem'))
      : [];

    if (cart) {
      this.items$.next(cart);
    }

    this.numOfItems$ = this.items$.pipe(
      map(items => items.reduce((acc, cur) => (acc += cur.quantity), 0))
    );

    this.totalPrice$ = this.items$.pipe(
      map(items =>
        items.reduce((acc, cur) => {
          DYNAMIC_CONFIG.currency.supportedCurrencies.forEach(code => {
            acc[code] = acc[code] || 0;
            acc[code] += cur.price[code] || 0;
          });

          return acc;
        }, {})
      )
    );
  }

  items$ = new BehaviorSubject<CartItem[]>([]);
  totalPrice$: Observable<Price>;
  numOfItems$: Observable<number>;

  add(item: Product, filters: any = {}) {
    let finalId = '';
    let filter = '';

    for (const key in filters) {
      finalId = finalId
        ? `${finalId}_${filters[key]}`
        : `${item.id}_${filters[key]}`;
      filter = filter ? `${filter}_${filters[key]}` : `${filters[key]}`;
    }

    this.items$.pipe(take(1)).subscribe(current => {
      const index = current.findIndex(cur =>
        finalId ? cur.identifier === finalId : cur.identifier === item.id
      );

      if (index === -1) {
        current.push({
          name: item.name,
          productId: item.id,
          image: item.gallery[0],
          quantity: 1,
          allowOutOfQuantityPurchase: item.allowOutOfQuantityPurchase,
          price: filter ? item.inventory[filter].price : item.price,
          maxQuantity: filter ? item.inventory[filter].quantity : item.quantity,
          identifier: finalId ? finalId : item.id,
          ...(finalId ? {filters} : {})
        });
      } else {
        current[index]['quantity'] += 1;
      }

      this.snackBar.open('Product added to cart', 'Dismiss', {
        duration: 2000
      });

      localStorage.setItem('cartItem', JSON.stringify(current));

      this.items$.next(current);
    });
  }

  changeNumber(identifier: string, addedQuantity: number) {
    this.items$.pipe(take(1)).subscribe(current => {
      const index = current.findIndex(cur => cur.identifier === identifier);
      current[index].quantity += addedQuantity;
      localStorage.setItem('cartItem', JSON.stringify(current));
      this.items$.next(current);
    });
  }

  remove(identifier: string) {
    this.items$.pipe(take(1)).subscribe(current => {
      const index = current.findIndex(cur => cur.identifier === identifier);
      current.splice(index, 1);
      localStorage.setItem('cartItem', JSON.stringify(current));
      this.items$.next(current);
    });
  }

  clear() {
    localStorage.removeItem('cartItem');
    this.items$.next([]);
  }
}
