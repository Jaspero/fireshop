import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {auth} from 'firebase/app';
import {from, throwError} from 'rxjs';
import {catchError, filter} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../environments/static-config';
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
    public fb: FormBuilder
  ) {}

  @ViewChild('password', {static: true}) passwordField: ElementRef;

  loginForm: FormGroup;
  staticConfig = STATIC_CONFIG;

  ngOnInit() {
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
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginEmail() {
    return () => {
      const data = this.loginForm.getRawValue();

      return from(
        this.afAuth.auth.signInWithEmailAndPassword(
          data.emailLogin,
          data.passwordLogin
        )
      ).pipe(
        notify({
          error:
            'The email and password you entered did not match our records. Please double-check and try again.'
        }),
        catchError(error => {
          this.loginForm.get('passwordLogin').reset();
          this.passwordField.nativeElement.focus();
          return throwError(error);
        })
      );
    };
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', Validators.required]
    });
  }
}
