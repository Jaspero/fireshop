import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LoadState} from '@jf/enums/load-state.enum';
import {Review} from '@jf/interfaces/review.interface';
import {confirmation} from '@jf/utils/confirmation';
import {notify} from '@jf/utils/notify.operator';
import {BehaviorSubject, from} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'jfs-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent extends RxDestroy implements OnInit {
  constructor(
    private dialog: MatDialog,
    private afs: AngularFirestore,
    private cdr: ChangeDetectorRef,
    private afAuth: AngularFireAuth
  ) {
    super();
  }

  dataState = LoadState;
  state$ = new BehaviorSubject<{
    state: LoadState;
    data: any;
  }>({
    state: LoadState.Loading,
    data: []
  });

  ngOnInit() {
    this.afs
      .collection<Review>(FirestoreCollections.Reviews, ref => {
        return ref.where(
          'customerInfo.id',
          FirebaseOperator.Equal,
          this.afAuth.auth.currentUser.uid
        );
      })
      .valueChanges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        this.state$.next({
          state: value.length ? LoadState.Loaded : LoadState.Empty,
          data: value
        });

        this.cdr.detectChanges();
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
