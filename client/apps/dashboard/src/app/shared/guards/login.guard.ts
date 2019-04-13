import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {CanActivate, Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  canActivate() {
    return this.afAuth.user.pipe(
      map(user => !user),
      tap(notLoggedIn => {
        if (!notLoggedIn) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
}
