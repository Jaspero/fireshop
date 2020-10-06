import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
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
    public router: Router,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth
  ) {}

  form: FormGroup;
  staticConfig = STATIC_CONFIG;

  ngOnInit() {
    this.form = this.fb.group({
      email: ['',
        [
          Validators.required,
          Validators.email
        ]
      ]
    });
  }

  reset() {
    return () =>
      from(this.afAuth.sendPasswordResetEmail(this.form.get('email').value))
        .pipe(
          tap(() => {
            this.form.reset();
            this.form.markAsPristine();
          }),
          notify({
            success: 'RESET_PASSWORD.SUCCESS_MESSAGE',
            error: 'RESET_PASSWORD.ERROR_MESSAGE'
          })
        )
  }
}
