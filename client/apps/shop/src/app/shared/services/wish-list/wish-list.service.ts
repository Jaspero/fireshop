import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {filter, map, startWith, take} from 'rxjs/operators';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LoginSignupDialogComponent} from '../../components/login-signup-dialog/login-signup-dialog.component';
import {StateService} from '../state/state.service';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  constructor(
    private state: StateService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog
  ) {
    this.wishList$ = this.state.user$.pipe(
      filter(user => !!(user && user.customerData)),
      map(user => {
        return user.customerData.wishList || [];
      })
    );
  }

  wishList$: Observable<string[]>;

  includes(productId: string): Observable<boolean> {
    return this.wishList$.pipe(
      startWith([]),
      map(wishList => {
        return wishList ? wishList.includes(productId) : undefined;
      })
    );
  }

  /**
   * Adds the product to the customers wish list
   * or removes it if it's currently on it
   */
  toggle(productId: string) {
    if (this.afAuth.auth.currentUser) {
      this.wishList$.pipe(take(1)).subscribe(wishList => {
        const index = wishList.indexOf(productId);

        if (index !== -1) {
          wishList.splice(index, 1);
        } else {
          wishList.push(productId);
        }

        this.afs
          .doc(
            `${FirestoreCollections.Customers}/${
              this.afAuth.auth.currentUser.uid
            }`
          )
          .update({wishList});
      });
    } else {
      this.dialog.open(LoginSignupDialogComponent);
    }
  }
}
