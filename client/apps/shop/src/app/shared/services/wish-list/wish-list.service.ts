import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {CustomerWishList} from '@jf/interfaces/customer.interface';
import {Observable} from 'rxjs';
import {filter, map, startWith, take} from 'rxjs/operators';
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
      map(user => ({
        wishList: user.customerData.wishList || [],
        wishListSnippets: user.customerData.wishListSnippets || []
      }))
    );
  }

  wishList$: Observable<{
    wishList: string[];
    wishListSnippets: CustomerWishList[];
  }>;

  includes(productId): Observable<boolean> {
    return this.wishList$.pipe(
      startWith({wishList: [], wishListSnippets: []}),
      map(wishList => wishList.wishList.some(x => x === productId))
    );
  }

  /**
   * Adds the product to the customers wish list
   * or removes it if it's currently on it
   */
  toggle(data) {
    if (this.afAuth.auth.currentUser) {
      this.wishList$.pipe(take(1)).subscribe(wishList => {
        const index = wishList.wishList.findIndex(x => x === data.id);

        if (index !== -1) {
          wishList.wishList.splice(index, 1);
          wishList.wishListSnippets.splice(index, 1);
        } else {
          wishList.wishList.push(data.id);
          wishList.wishListSnippets.push({
            name: data.name,
            addedOn: Date.now()
          });
        }
        this.afs
          .doc(
            `${FirestoreCollections.Customers}/${
              this.afAuth.auth.currentUser.uid
            }`
          )
          .update({
            ...wishList
          });
      });
    } else {
      this.dialog.open(LoginSignupDialogComponent);
    }
  }
}
