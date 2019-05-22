import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as firebase from 'firebase';
import {from} from 'rxjs';
import {FirestoreCollection} from '../../shared/enums/firestore-collection.enum';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  constructor(private afs: AngularFirestore, private fb: FormBuilder) {}

  role = ['write', 'read'];
  form: FormGroup;
  users = [];

  ngOnInit() {
    this.afs
      .collection(FirestoreCollection.Settings)
      .doc('user')
      .get()
      .subscribe(val => {
        this.users.push(val.data());
        console.log(this.users, 'user');
      });

    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  save() {
    const data = this.form.getRawValue();
    from(
      this.afs
        .collection(FirestoreCollection.Settings)
        .doc('user')
        .update({
          roles: firebase.firestore.FieldValue.arrayUnion(data)
        })
    )
      .pipe(notify())
      .subscribe();
  }
}
