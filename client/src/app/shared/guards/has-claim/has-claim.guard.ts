import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {CanActivate, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {StateService} from '../../services/state/state.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirestoreCollection} from '../../../../../integrations/firebase/firestore-collection.enum';
import {auth} from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class HasClaimGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private state: StateService,
    private router: Router,
    private afs: AngularFirestore
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
          return this.afs
            .collection(FirestoreCollection.Users)
            .doc(claims.user_id)
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
        catchError((e) => {
          return this.signOut();
        })
      );
  }

  signOut() {
    auth().signOut()
      .then()
      .catch()
      .finally(() => {
        this.router.navigate(['/login']);
      });

    return of(false);
  }
}
