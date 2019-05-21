import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as firebase from 'firebase';
import {Observable, ObservedValueOf} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {FirestoreCollection} from '../../shared/enums/firestore-collection.enum';
import {Module} from '../../shared/interfaces/module.interface';

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
  userData$: Observable<[]>;

  ngOnInit() {
    this.userData$ = this.afs
      .collection(FirestoreCollection.Settings)
      .doc('user')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => ({
            id: action.payload.doc.id,
            ...(action.payload.doc.data() as Module)
          }));
        }),
        shareReplay(1)
      );

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

    this.afs
      .collection(FirestoreCollection.Settings)
      .doc('user')
      .update({
        roles: firebase.firestore.FieldValue.arrayUnion(data)
      });
  }
}
