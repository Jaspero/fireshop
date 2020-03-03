import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'jfs-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteUserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private router: Router
  ) {}

  deleteForm: FormGroup;

  ngOnInit() {
    this.buildDeleteForm();
  }

  closeDeleteDialog() {
    this.dialogRef.close();
  }

  permaDeleteUser() {
    this.afs
      .doc(
        `${FirestoreCollections.Customers}/${this.afAuth.auth.currentUser.uid}`
      )
      .delete()
      .then(() => {
        this.dialogRef.close();
        this.afAuth.auth.signOut();
        this.router.navigate(['/']);
      })
      .catch(() => {});
  }

  private buildDeleteForm() {
    this.deleteForm = this.fb.group({
      emailConfirmControl: [
        '',
        [
          Validators.required,
          Validators.pattern(this.afAuth.auth.currentUser.email)
        ]
      ],
      wordDelete: [
        '',
        [Validators.required, Validators.pattern('discombobulate')]
      ]
    });
  }
}
