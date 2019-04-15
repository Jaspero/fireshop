import {Component, HostBinding, Input} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Review} from '@jf/interfaces/review.interface';
import {confirmation} from '@jf/utils/confirmation';
import {notify} from '@jf/utils/notify.operator';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ReviewsDialogComponent} from '../reviews/reviews-dialog.component';

@Component({
  selector: 'jfs-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent {
  constructor(
    private dialog: MatDialog,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {}

  @Input()
  review: Review;
  fiveStar = new Array(5);

  edit() {
    this.dialog.open(ReviewsDialogComponent, {
      width: '500px'
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
