import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslocoService} from '@ngneat/transloco';
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
    private fb: FormBuilder,
    private transloco: TranslocoService
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
          success: this.transloco.translate('RESET_PASSWORD.SUCCESS_MESSAGE'),
          error: this.transloco.translate('RESET_PASSWORD.ERROR_MESSAGE')
        })
      )
      .subscribe();
  }
}
