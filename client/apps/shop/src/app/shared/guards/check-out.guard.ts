import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CartService} from '../services/cart/cart.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckOutGuard implements CanActivate {
  constructor(private cartService: CartService) {}

  canActivate() {
    return this.cartService.numOfItems$.pipe(map(res => !!res));
  }
}
