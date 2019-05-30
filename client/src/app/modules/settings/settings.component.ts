import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as firebase from 'firebase';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FirestoreCollection} from '../../shared/enums/firestore-collection.enum';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  role = ['write', 'read'];
  form: FormGroup;
  users = [];

  ngOnInit() {
    this.form = this.fb.group({
      roles: this.fb.array([])
    });

    this.afs
      .collection(FirestoreCollection.Settings)
      .doc('user')
      .get()
      .subscribe(val => {
        this.cdr.detectChanges();
      });
  }

  get userForm() {
    return this.form.get('roles') as FormArray;
  }

  add() {
    const user = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    this.userForm.push(user);
  }

  delete(index) {
    this.userForm.removeAt(index);
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
