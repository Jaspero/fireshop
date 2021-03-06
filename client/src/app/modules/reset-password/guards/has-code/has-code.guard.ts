import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {from, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {notify} from '../../../../shared/utils/notify.operator';

@Injectable()
export class HasCodeGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (route.queryParams.oobCode) {
      return from(
        this.afAuth.verifyPasswordResetCode(route.queryParams.oobCode)
      )
        .pipe(
          map(() => true),
          notify({
            success: false,
            error: 'RESET_PASSWORD.INVALID_OOB_CODE'
          }),
          catchError(() => {
            this.router.navigate(['/login']);
            return of(false)
          })
        )
    }

    this.router.navigate(['/login']);
    return of(false)
  }
}
