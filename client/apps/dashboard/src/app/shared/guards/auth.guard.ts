import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {CanActivate, Router} from '@angular/router';
import {from, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {Role} from '../enums/role.enum';
import {StateService} from '../services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private state: StateService
  ) {}

  canActivate() {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!this.state.role && user) {
          /**
           * Check the users role if we don't
           * know it already
           */
          return from(user.getIdTokenResult()).pipe(
            map(res => {
              this.state.role = Role.Read;
              // this.state.role = res.claims.role;

              return true;
            })
          );
        } else {
          return of(!!user);
        }
      }),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
