import {Component, HostBinding, Inject, Input} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Review} from '@jf/interfaces/review.interface';
import {confirmation} from '@jf/utils/confirmation';
import {UNIQUE_ID, UNIQUE_ID_PROVIDER} from '@jf/utils/id.provider';
import {notify} from '@jf/utils/notify.operator';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ReviewsDialogComponent} from '../reviews/reviews-dialog.component';

@Component({
  selector: 'jfs-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  providers: [UNIQUE_ID_PROVIDER]
})
export class ReviewCardComponent {
  constructor(
    @Inject(UNIQUE_ID)
    public uniqueId: string,
    private dialog: MatDialog,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {}

  @Input()
  review: Review;
  isEdit: boolean;

  edit() {
    this.isEdit = true;

    this.dialog.open(ReviewsDialogComponent, {
      data: this.review
    });
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
