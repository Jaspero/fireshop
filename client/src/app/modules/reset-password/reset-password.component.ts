import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {from} from 'rxjs';
import {STATIC_CONFIG} from '../../../environments/static-config';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private fb: FormBuilder
  ) {}

  resetControl: FormControl;
  staticConfig = STATIC_CONFIG;

  ngOnInit() {
    this.resetControl = this.fb.control('', [
      Validators.required,
      Validators.email
    ]);
  }

  reset() {
    from(this.afAuth.auth.sendPasswordResetEmail(this.resetControl.value))
      .pipe(
        notify({
          success: 'Password reset email has been sent to your email',
          error: 'Email is invalid'
        })
      )
      .subscribe();
  }
}
