import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {auth} from 'firebase/app';
import {from, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasCodeGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams.oobCode) {
      return from(
        auth().verifyPasswordResetCode(route.queryParams.oobCode)
      )
        .pipe(
          map(() => true),
          catchError(() => of(false))
        )
    }

    this.router.navigate(['/login']);
    return of(false)
  }
}
