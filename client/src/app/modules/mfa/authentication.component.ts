import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import 'firebase/auth';
import {auth} from 'firebase/app';
import {from} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {COUNTRIES} from '../../shared/consts/countries.const';
import {notify} from '../../shared/utils/notify.operator';

@UntilDestroy()
@Component({
  selector: 'jms-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private afAuth: AngularFireAuth
  ) { }

  form: FormGroup;
  oobCode: string;
  countries = COUNTRIES;

  recaptcha: auth.RecaptchaVerifier;

  prefix: string;

  ngOnInit() {
    this.oobCode = this.activatedRoute.snapshot.queryParams.oobCode;

    // if (!this.oobCode) {
    //   this.router.navigate(['/login']);
    // }

    this.form = this.fb.group({
      countryCode: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.form.get('countryCode')
      .valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(code => {
        this.prefix = COUNTRIES.find(country => country.code === code).phonePrefix;

        auth().languageCode = code;

        if (!this.recaptcha) {
          this.recaptcha = new auth.RecaptchaVerifier('mfa-submit', {
            size: 'invisible',
            callback: () => {
              console.log(321);
            }
          });
        } else {
          this.recaptcha.clear();
        }

        this.recaptcha.render();

        this.cdr.markForCheck();
      })
  }

  submit() {
    console.log(21312);

    from(
      this.recaptcha.verify()
    )
      .pipe(
        switchMap(() =>
          this.afAuth.checkActionCode(this.oobCode)
        ),
        switchMap(() =>
          this.afAuth.applyActionCode(this.oobCode)
        ),
        switchMap(() =>
          this.afAuth.user
        ),
        switchMap(user =>
          user.multiFactor.getSession()
        ),
        switchMap(session => {

          const {phone} = this.form.getRawValue();

          const phoneAuthProvider = new auth.PhoneAuthProvider();
          return phoneAuthProvider.verifyPhoneNumber({phoneNumber: this.prefix + phone, session}, this.recaptcha);
        }),
        tap(() => {
        }),
        notify()
      )

  }
}
