import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {StateService} from '../../services/state/state.service';
import {Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasClaimGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private state: StateService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {

    if (this.state.role) {
      return of(true);
    }

    return this.afAuth.idTokenResult
      .pipe(
        map(({claims}) => {
          this.state.role = claims.role;
          return true;
        }),
        catchError(() => {
          this.afAuth.auth.signOut()
            .then(() =>
              this.router.navigate(['/login'])
            )
            .catch(() =>
              this.router.navigate(['/login'])
            );

          return of(false)
        })
      )
  }
}
