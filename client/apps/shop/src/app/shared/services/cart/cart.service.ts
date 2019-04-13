import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private snackBar: MatSnackBar) {
    const cart = JSON.parse(localStorage.getItem('cartItem'));
    if (cart) {
      this.items$.next(cart);
    }
    this.numOfItems$ = this.items$.pipe(
      map(items =>
        items.length ? items.reduce((acc, cur) => (acc += cur.quantity), 0) : ''
      )
    );

    this.totalPrice$ = this.items$.pipe(
      map(items => {
        return items.reduce((acc, cur) => {
          return (acc += cur['quantity'] * cur['price']);
        }, 0);
      })
    );
  }

  items$ = new BehaviorSubject<any[]>([]);
  totalPrice$: Observable<number>;
  numOfItems$: Observable<number>;

  add(item, filters) {
    const current = this.items$.getValue();
    let productId = item.id;
    if (filters) {
      productId = `${productId}-${filters.size}`;
    }
    const index = current.findIndex(val => val['productId'] === productId);
    if (index === -1) {
      current.push({
        identifier: item.id,
        name: item.name,
        price: item.price,
        productId: productId,
        quantity: 1,
        image: item.gallery[0],
        size: filters ? filters.size : null
      });
      this.snackBar.open('Product added to cart', 'Dismiss', {
        duration: 2000
      });
    } else {
      current[index]['quantity'] += 1;
      this.snackBar.open('Product added to cart', 'Dismiss', {
        duration: 2000
      });
    }

    localStorage.setItem('cartItem', JSON.stringify(current));
    this.items$.next(current);
  }

  changeNumber(product, num) {
    const current = this.items$.getValue();
    const index = current.findIndex(res => res['productId'] === product);
    current[index]['quantity'] += num;
    localStorage.setItem('cartItem', JSON.stringify(current));
    this.items$.next(current);
  }

  remove(product) {
    const current = this.items$.getValue();
    const index = current.findIndex(res => res['productId'] === product);
    current.splice(index, 1);
    localStorage.setItem('cartItem', JSON.stringify(current));
    this.items$.next(current);
  }

  clear() {
    localStorage.removeItem('cartItem');
    this.items$.next([]);
  }
}
