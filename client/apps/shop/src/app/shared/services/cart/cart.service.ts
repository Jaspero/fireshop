import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private snackBar: MatSnackBar, private afs: AngularFirestore) {
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
  totalQun: 0;

  add(item) {
    const current = this.items$.getValue();

    const index = current.findIndex(val => val['productId'] === item.id);

    if (index === -1) {
      current.push({
        identifier: item.id,
        name: item.name,
        price: item.price,
        productId: item.id,
        image: item.gallery[0],
        quantity: 1
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
    const index = current.findIndex(res => res['productId'] === product);
    current[index]['quantity'] += num;
    localStorage.setItem('cartItem', JSON.stringify(current));
    this.items$.next(current);

    //TODO: do this better way, (disabling increase button in cart when there are no more product in storage(quantity))
    this.afs
      .collection(`${FirestoreCollections.Products}-en`)
      .doc(product)
      .get()
      .subscribe(val => {
        this.totalQun = val.data().quantity;
      });
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
