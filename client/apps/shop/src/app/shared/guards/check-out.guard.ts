import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CartService} from '../services/cart/cart.service';
import {map} from 'rxjs/operators';
import {StateService} from '../services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class CheckOutGuard implements CanActivate {
  constructor(private cartService: CartService, private state: StateService) {}

  canActivate() {
    this.state.checkOutToggle = false;
    return this.cartService.numOfItems$.pipe(map(res => !!res));
  }
}
