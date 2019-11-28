import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {CanActivate, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {DbService} from '../../services/db/db.service';
import {StateService} from '../../services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class HasClaimGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private state: StateService,
    private dbService: DbService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {

    if (this.state.role) {
      return of(true);
    }

    return this.afAuth.idTokenResult
      .pipe(
        take(1),
        switchMap(({claims}) => {
          this.state.role = claims.role;
          return this.dbService.getDocument(
            'users',
            claims.user_id
          );
        }),
        map((user) => {
          this.state.user = user;
          return true;
        }),
        catchError((e) => {
          return this.signOut();
        })
      );
  }

  signOut() {
    this.afAuth.auth.signOut()
      .then()
      .catch()
      .finally(() => {
        this.router.navigate(['/login']);
      });

    return of(false);
  }
}
