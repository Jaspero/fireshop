import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {auth} from 'firebase/app';
import {from} from 'rxjs';
import {tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';
import {notify} from '../../shared/utils/notify.operator';
import {RepeatPasswordValidator} from '../../shared/validators/repeat-password.validator';

@Component({
  selector: 'jms-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  form: FormGroup;
  staticConfig = STATIC_CONFIG;
  code: string;

  ngOnInit() {

    this.code = this.activatedRoute.snapshot.queryParams.oobCode;

    this.form = this.fb.group(
      {
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      },
      {
        validator: RepeatPasswordValidator('')
      }
    );
  }

  reset() {
    return () =>
      from(
        auth().confirmPasswordReset(
          this.code,
          this.form.get('password').value
        )
      )
        .pipe(
          notify({
            success: 'RESET_PASSWORD.RESET_SUCCESSFUL'
          }),
          tap(() =>
            this.router.navigate(['/login'])
          )
        )
  }
}
