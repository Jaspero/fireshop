import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {BROWSER_CONFIG} from '@jf/consts/browser-config.const';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
      map(items =>
        items.length ? items.reduce((acc, cur) => (acc += cur.quantity), 0) : ''
      )
    );

    this.totalPrice$ = this.items$.pipe(
      map(items =>
        items.reduce((acc, cur) => (acc += cur['quantity'] * cur['price']), 0)
      )
    );
  }

  items$ = new BehaviorSubject<any[]>([]);
  totalPrice$: Observable<number>;
  numOfItems$: Observable<number>;

  add(item, filters = {}) {
    let finalId = '';
    let filter = '';
    for (const key in filters) {
      finalId = finalId
        ? `${finalId}_${filters[key]}`
        : `${item.id}_${filters[key]}`;
      filter = filter ? `${filter}_${filters[key]}` : `${filters[key]}`;
    }
    const current = this.items$.getValue();
    const index = current.findIndex(val =>
      finalId ? val['identifier'] === finalId : val['identifier'] === item.id
    );

    if (index === -1) {
      current.push({
        identifier: finalId ? finalId : item.id,
        name: item.name,
        price: item.price,
        productId: item.id,
        image: filter ? item.inventory[filter].quantity : item.gallery[0],
        quantity: 1,
        maxQuantity: item.quantity,
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
  }

  changeNumber(product, num) {
    const current = this.items$.getValue();
    console.log('current', current);
    const index = current.findIndex(res => res['identifier'] === product);
    current[index]['quantity'] += num;
    localStorage.setItem('cartItem', JSON.stringify(current));
    this.items$.next(current);
  }

  remove(product) {
    const current = this.items$.getValue();
    const index = current.findIndex(res => res['identifier'] === product);
    current.splice(index, 1);
    localStorage.setItem('cartItem', JSON.stringify(current));
    this.items$.next(current);
  }

  clear() {
    localStorage.removeItem('cartItem');
    this.items$.next([]);
  }
}
