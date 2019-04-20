import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DeleteUserComponent} from '../../components/delete-user/delete-user.component';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'jfs-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private cdr: ChangeDetectorRef
  ) {}

  form: FormGroup;

  ngOnInit() {
    this.afs
      .doc(
        `${FirestoreCollections.Customers}/${this.afAuth.auth.currentUser.uid}`
      )
      .valueChanges()
      .subscribe(data => {
        this.buildForm(data);
        this.cdr.detectChanges();
      });
  }

  deleteUser() {
    this.dialog.open(DeleteUserComponent);
  }

  buildForm(data) {
    this.form = this.fb.group({
      createdOn: data.createdOn || '',
      nickname: data.nickname || '',
      gender: data.gender || '',
      bio: data.bio || ''
    });
  }

  submitForm() {
    const data = this.form.getRawValue();
    this.afs
      .doc(
        `${FirestoreCollections.Customers}/${this.afAuth.auth.currentUser.uid}`
      )
      .set(data)
      .finally();
  }
}
