import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import {from, of, throwError} from 'rxjs';
import {catchError, filter, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';
import {StateService} from '../../shared/services/state/state.service';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public fb: FormBuilder,
    private state: StateService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  @ViewChild('password', {static: true})
  passwordField: ElementRef;

  @ViewChild('mfaVerification', {static: true})
  mfaVerificationTemp: TemplateRef<any>;

  loginForm: FormGroup;
  staticConfig = STATIC_CONFIG;
  codeForm: FormGroup;
  resolver: firebase.auth.MultiFactorResolver;
  verifier: firebase.auth.RecaptchaVerifier;
  verificationState: string;
  verificationId: string;
  deviceForm: FormGroup;

  errorMap = {
    'auth/wrong-password': 'LOGIN.ERROR_MESSAGE',
    'auth/too-many-requests': 'LOGIN.TOO_MANY_ATTEMPTS_TRY_LATER',
    'auth/user-not-found': 'LOGIN.USER_NOT_FOUND'
  };

  ngOnInit() {

    /**
     * Makes sure roles aren't preserved
     * between logout/login
     */
    this.state.role = null;

    this.afAuth.user
      .pipe(
        filter(user => !!user)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });

    this.buildForm();
  }

  loginGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(e => {
        if (e.code === 'auth/multi-factor-auth-required') {
          this.openMfa(e.resolver);
        }
      });
  }

  loginFacebook() {
    this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .catch(e => {
        if (e.code === 'auth/multi-factor-auth-required') {
          this.openMfa(e.resolver);
        }
      });
  }

  loginEmail() {
    return () => {
      const data = this.loginForm.getRawValue();

      return from(
        this.afAuth.signInWithEmailAndPassword(
          data.emailLogin,
          data.passwordLogin
        )
      ).pipe(
        catchError(error => {
          this.loginForm.get('passwordLogin').reset();
          this.passwordField.nativeElement.focus();


          if (error.code === 'auth/multi-factor-auth-required') {
            this.openMfa(error.resolver);
            return of(true);
          } else {
            this.loginForm.get('passwordLogin').reset();
            this.passwordField.nativeElement.focus();
          }

          return throwError({
            message: this.errorMap[error.code] || 'LOGIN.ERROR_MESSAGE'
          })
            .pipe(
              notify()
            );
        }),
      );
    };
  }

  verifyMfa() {
    return () => {

      const {code} = this.codeForm.getRawValue();

      return from(
        this.resolver.resolveSignIn(
          firebase.auth.PhoneMultiFactorGenerator.assertion(
            firebase.auth.PhoneAuthProvider.credential(this.verificationId, code)
          )
        )
      )
        .pipe(
          tap(() => {
            this.dialog.closeAll();
          }),
          notify({
            success: false,
            showThrownError: true
          })
        )
    }
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', Validators.required]
    });
  }

  private openMfa(resolver: firebase.auth.MultiFactorResolver) {

    this.resolver = resolver;
    this.verificationState = 'select';

    this.deviceForm = this.fb.group({
      device: resolver.hints[resolver.hints.length - 1].uid
    });

    this.dialog.open(
      this.mfaVerificationTemp,
      {
        width: '400px'
      }
    )
      .afterOpened()
      .subscribe(() => {
        this.verifier = new firebase.auth.RecaptchaVerifier('mfa-submit', {
          size: 'invisible',
          callback: () => {
            this.codeForm = this.fb.group({
              code: ['', Validators.required]
            });

            const {device} = this.deviceForm.getRawValue();

            const verify = () => from(
              new firebase.auth.PhoneAuthProvider()
                .verifyPhoneNumber(
                  {
                    multiFactorHint: this.resolver.hints.find(hint => hint.uid === device),
                    session: this.resolver.session
                  },
                  this.verifier
                )
            );

            verify()
              .pipe(
                catchError(e => {
                  this.verifier.clear();
                  return verify();
                })
              )
              .subscribe(vId => {
                this.zone.run(() => {
                  this.verificationId = vId;
                  this.verificationState = 'submit';
                  this.cdr.markForCheck();
                })
              });
          }
        });

        this.verifier.render();
      })
  }
}
