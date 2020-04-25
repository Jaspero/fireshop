import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {from} from 'rxjs';
import {STATIC_CONFIG} from '../../../environments/static-config';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-trigger-password-reset',
  templateUrl: './trigger-password-reset.component.html',
  styleUrls: ['./trigger-password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriggerPasswordResetComponent implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private fb: FormBuilder,
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
          success: 'RESET_PASSWORD.SUCCESS_MESSAGE',
          error: 'RESET_PASSWORD.ERROR_MESSAGE'
        })
      )
      .subscribe();
  }
}
