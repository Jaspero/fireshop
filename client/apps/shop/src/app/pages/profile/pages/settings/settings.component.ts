import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {notify} from '@jf/utils/notify.operator';
import * as firebase from 'firebase';
import {RepeatPasswordValidator} from '../../../../shared/helpers/compare-passwords';
import {DeleteUserComponent} from '../../components/delete-user/delete-user.component';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {map, switchMap, take, takeUntil} from 'rxjs/operators';
import {RxDestroy} from '@jaspero/ng-helpers';
import {from, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'jfs-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent extends RxDestroy implements OnInit {
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    super();
  }

  form$: Observable<FormGroup>;
  passwordForm: FormGroup;

  private shippingSubscription: Subscription;

  ngOnInit() {
    this.form$ = this.afAuth.user.pipe(
      switchMap(user =>
        this.afs
          .doc(`${FirestoreCollections.Customers}/${user.uid}`)
          .valueChanges()
          .pipe(
            take(1),
            map(value => this.buildForm(value || {}))
          )
      )
    );
  }

  deleteUser() {
    this.dialog.open(DeleteUserComponent);
  }

  buildForm(data) {
    this.passwordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.afAuth.auth.currentUser.email)
        ]
      ],
      pg: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(6)]],
          repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
        },
        {validator: RepeatPasswordValidator('Passwords not matching')}
      )
    });

    const group = this.fb.group({
      fullName: data.fullName || '',
      gender: data.gender || '',
      bio: data.bio || '',
      billing: this.checkForm(data.billing ? data.billing : {}),
      shippingInfo: data.shippingInfo || true
    });

    if (this.shippingSubscription) {
      this.shippingSubscription.unsubscribe();
    }

    this.shippingSubscription = group
      .get('shippingInfo')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        if (value) {
          group.removeControl('shipping');
        } else {
          group.addControl('shipping', this.checkForm(value.shipping || {}));
        }
      });

    return group;
  }

  checkForm(data: any) {
    return this.fb.group({
      firstName: [data.firstName || '', Validators.required],
      lastName: [data.lastName || '', Validators.required],
      email: [data.email || '', Validators.required],
      phone: [data.phone || '', Validators.required],
      city: [data.city || '', Validators.required],
      zip: [data.zip || '', Validators.required],
      country: [data.country || '', Validators.required],
      line1: [data.line1 || '', Validators.required],
      line2: [data.line2 || '']
    });
  }

  submitForm(data) {
    this.afs
      .doc(
        `${FirestoreCollections.Customers}/${this.afAuth.auth.currentUser.uid}`
      )
      .update(data);
  }

  changePassword() {
    const pass = this.passwordForm.getRawValue();

    from(this.afAuth.auth.currentUser.updatePassword(pass.pg.password))
      .pipe(notify())
      .subscribe();
  }
}
