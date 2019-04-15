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
    public data: {
      productId: string;
      createdOn: number;
      customerId: string;
      customerName: string;
      orderId?: string;
    }
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  submit() {
    const {comment, rating} = this.form.getRawValue();

    from(
      this.afs
        .collection(FirestoreCollections.Reviews)
        .doc(nanoid())
        .set({
          ...this.data,
          comment,
          rating
        })
    )
      .pipe(notify())
      .subscribe(() => {
        this.dialog.close();
      });
  }

  private buildForm() {
    this.form = this.fb.group({
      dataProduct: [
        {value: this.data.productId, disabled: true},
        Validators.required
      ],
      comment: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }
}
