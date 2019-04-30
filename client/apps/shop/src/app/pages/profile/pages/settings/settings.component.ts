import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Observable, Subscription} from 'rxjs';
import {map, switchMap, take, takeUntil} from 'rxjs/operators';
import {DeleteUserComponent} from '../../components/delete-user/delete-user.component';

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
}
