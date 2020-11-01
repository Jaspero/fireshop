import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {CanActivate, Router} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../../integrations/firebase/firestore-collection.enum';
import {StateService} from '../../services/state/state.service';
import {notify} from '../../utils/notify.operator';

@Injectable({
  providedIn: 'root'
})
export class HasClaimGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private state: StateService,
    private router: Router,
    private afs: AngularFirestore,
    private transloco: TranslocoService
  ) {}

  canActivate(): Observable<boolean> {

    if (this.state.role) {
      return of(true);
    }

    return this.afAuth.idTokenResult
      .pipe(
        take(1),
        switchMap((data) => {

          /**
           * It's assumed that any user with a role claim
           * is allowed to access tha dashboard
           */
          if (!data || !data.claims.role) {
            return throwError(
              () =>
                this.transloco.translate('ERRORS.DASHBOARD_ACCESS')
            )
          }

          this.state.role = data.claims.role;

          return this.afs
            .collection(FirestoreCollection.Users)
            .doc(data.claims.user_id)
            .get({
              source: 'server'
            })
            .pipe(
              map((user: any) => ({
                id: user.id,
                ...user.data()
              }))
            );
        }),
        map((user) => {
          this.state.user = user;
          return true;
        }),
        catchError((e) =>
          this.signOut(e)
        ),
        notify({
          showThrownError: true,
          success: false
        })
      );
  }

  signOut(error: Error) {
    this.afAuth.signOut()
      .then()
      .catch()
      .finally(() => {
        this.router.navigate(['/login']);
      });

    return throwError(() => error);
  }
}
