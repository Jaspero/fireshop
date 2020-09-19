import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import 'firebase/auth';
import {auth} from 'firebase/app';
import {from, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {notify} from '../../../../shared/utils/notify.operator';

@Injectable()
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
          notify({
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
