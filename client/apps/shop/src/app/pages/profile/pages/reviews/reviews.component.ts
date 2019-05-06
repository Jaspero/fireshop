import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Review} from '@jf/interfaces/review.interface';
import {confirmation} from '@jf/utils/confirmation';
import {UNIQUE_ID, UNIQUE_ID_PROVIDER} from '@jf/utils/id.provider';
import {notify} from '@jf/utils/notify.operator';
import {from, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfs-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  myReviews$: Observable<Review[]>;

  ngOnInit() {
    this.myReviews$ = this.afs
      .collection<Review>(FirestoreCollections.Reviews, ref =>
        ref.where(
          'customerId',
          FirebaseOperator.Equal,
          this.afAuth.auth.currentUser.uid
        )
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            const data = action.payload.doc.data();

            return {
              id: action.payload.doc.id,
              ...data
            };
          })
        )
      );
  }

  delete(id: string) {
    confirmation([
      switchMap(() =>
        from(
          this.afs
            .collection(FirestoreCollections.Reviews)
            .doc(id)
            .delete()
        )
      ),
      notify()
    ]);
  }
}
