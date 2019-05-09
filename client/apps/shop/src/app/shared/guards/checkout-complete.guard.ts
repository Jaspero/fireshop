import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {StateService} from '../services/state/state.service';

@Injectable()
export class CheckoutCompleteGuard implements CanActivate {
  constructor(private state: StateService, private router: Router) {}

  canActivate() {
    this.state.checkoutResult = JSON.parse(localStorage.getItem('result'));
    return this.state.checkoutResult ? true : this.router.navigate(['/']);
  }
}
