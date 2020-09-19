import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {auth} from 'firebase/app';
import {from, throwError} from 'rxjs';
import {catchError, filter} from 'rxjs/operators';
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
    private state: StateService
  ) {}

  @ViewChild('password', {static: true}) passwordField: ElementRef;

  loginForm: FormGroup;
  staticConfig = STATIC_CONFIG;

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
    auth().signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginFacebook() {
    auth().signInWithPopup(new auth.FacebookAuthProvider());
  }

  loginEmail() {
    return () => {
      const data = this.loginForm.getRawValue();

      return from(
        auth().signInWithEmailAndPassword(
          data.emailLogin,
          data.passwordLogin
        )
      ).pipe(
        notify({
          success: null,
          error: 'LOGIN.ERROR_MESSAGE'
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
