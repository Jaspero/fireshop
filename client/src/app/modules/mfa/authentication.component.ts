import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import 'firebase/auth';
import firebase from 'firebase/app';
import {from, Subscription, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
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
    private afAuth: AngularFireAuth,
    private dialog: MatDialog
  ) { }

  @ViewChild('verificationDialog', {static: true})
  verificationDialogTemp: TemplateRef<any>;

  form: FormGroup;
  oobCode: string;
  countries = COUNTRIES;

  recaptcha: firebase.auth.RecaptchaVerifier;
  mfa: firebase.User.MultiFactorUser;
  codeForm: FormGroup;
  prefix: string;
  confirmationResult: string;

  private subscription: Subscription;

  ngOnInit() {
    this.oobCode = this.activatedRoute.snapshot.queryParams.oobCode;

    if (!this.oobCode) {
      this.router.navigate(['/login']);
    }

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

        firebase.auth().languageCode = code;

        if (!this.recaptcha) {
          this.recaptcha = new firebase.auth.RecaptchaVerifier('mfa-submit', {
            size: 'invisible',
            callback: () => this.submit()
          });

          this.recaptcha.render();
        }

        this.cdr.markForCheck();
      })
  }

  submit() {
    console.log('here');
    this.subscription = from(
      this.afAuth.checkActionCode(this.oobCode)
    )
      .pipe(
        switchMap(() =>
          this.afAuth.applyActionCode(this.oobCode)
        ),
        switchMap(() =>
          this.afAuth.user
        ),
        switchMap(user => {
          this.mfa = user.multiFactor;
          return this.mfa.getSession();
        }),
        switchMap(session => {

          const {phone} = this.form.getRawValue();

          const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
          return phoneAuthProvider.verifyPhoneNumber({phoneNumber: this.prefix + phone, session}, this.recaptcha);
        }),
        catchError(e => {
          if (e.code === 'auth/requires-recent-login') {
            this.router.navigate(['/login']);
            this.afAuth.signOut();
          }

          return throwError(e);
        }),
        notify({
          success: false,
          showThrownError: true
        })
      )
      .subscribe((verificationId) => {

        this.recaptcha.clear();
        this.recaptcha = null;

        this.subscription.unsubscribe();

        this.confirmationResult = verificationId;

        this.codeForm = this.fb.group({
          code: ['', Validators.required]
        });

        this.dialog.open(this.verificationDialogTemp, {
          width: '400px'
        });
      })
  }

  verify() {
    return () => {

      console.log('in here');

      const {code} = this.codeForm.getRawValue();

      const cred = firebase.auth.PhoneAuthProvider.credential(this.confirmationResult, code);
      const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);

      return from(
        this.mfa.enroll(multiFactorAssertion, 'Phone Number')
      )
        .pipe(
          notify(),
          tap(() => {
            this.dialog.closeAll();
            this.router.navigate(['/dashboard']);
          })
        )
    }
  }
}
