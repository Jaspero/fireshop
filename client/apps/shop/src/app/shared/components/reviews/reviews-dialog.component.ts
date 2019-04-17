import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatSnackBar
} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Review} from '@jf/interfaces/review.interface';
import * as nanoid from 'nanoid';
import {from} from 'rxjs';
import {notify} from '@jf/utils/notify.operator';

@Component({
  selector: 'jfs-reviews',
  templateUrl: './reviews-dialog.component.html',
  styleUrls: ['./reviews-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private dialog: MatDialogRef<any>,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: Review
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  submit() {
    const {comment, rating} = this.form.getRawValue();

    from(
      this.afs
        .collection(FirestoreCollections.Reviews)
        .doc(this.data.id ? this.data.id : nanoid())
        .set({
          ...this.data,
          comment,
          rating,
          ...(this.data.createdOn ? {} : {createdOn: Date.now()})
        })
    )
      .pipe(notify())
      .subscribe(() => {
        this.dialog.close();
      });
  }

  private buildForm() {
    this.form = this.fb.group({
      comment: [this.data.comment || '', Validators.required],
      rating: [
        this.data.rating || '',
        [Validators.required, Validators.min(1), Validators.max(5)]
      ]
    });
  }
}
