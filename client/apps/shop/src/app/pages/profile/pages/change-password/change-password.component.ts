import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {notify} from '@jf/utils/notify.operator';
import {from, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoginSignupDialogComponent} from '../../../../shared/components/login-signup-dialog/login-signup-dialog.component';
import {RepeatPasswordValidator} from '../../../../shared/helpers/compare-passwords';

@Component({
  selector: 'jfs-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private dialog: MatDialog
  ) {}

  passwordForm: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
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
  }

  changePassword() {
    const pass = this.passwordForm.getRawValue();

    from(this.afAuth.auth.currentUser.updatePassword(pass.pg.password))
      .pipe(
        notify({
          error:
            'You must relogin to update you password because of the security reasons'
        }),
        catchError(err => {
          if (err.code === 'auth/requires-recent-login') {
            this.dialog.open(LoginSignupDialogComponent);
          }

          return throwError(err);
        })
      )
      .subscribe(() => {
        this.passwordForm.reset();
      });
  }
}
