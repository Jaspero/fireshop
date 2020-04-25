import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {from, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasCodeGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams.oobCode) {
      return from(
        this.afAuth.auth.verifyPasswordResetCode(route.queryParams.oobCode)
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
