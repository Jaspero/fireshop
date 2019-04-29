import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {auth} from 'firebase';
import {from} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {notify} from '@jf/utils/notify.operator';

@Component({
  selector: 'jfsc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild('password') passwordField: ElementRef;

  loginForm: FormGroup;

  ngOnInit() {
    this.afAuth.user
      .pipe(
        filter(user => !!user),
        switchMap(user => user.getIdTokenResult())
      )
      .subscribe(res => {
        if (res.claims.admin) {
          this.router.navigate(['/dashboard']);
        } else {
          this.afAuth.auth.signOut();
          this.snackBar.open(
            'Access to platform denied. Please contact an administrator.',
            'Dismiss',
            {duration: 2000}
          );
        }
      });

    this.buildForm();
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginFacebook() {
    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  loginTwitter() {
    this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
  }

  loginEmail() {
    const data = this.loginForm.getRawValue();
    from(
      this.afAuth.auth.signInWithEmailAndPassword(
        data.emailLogin,
        data.passwordLogin
      )
    )
      .pipe(
        notify({
          success: 'You are now logged in',
          error:
            'The email and password you entered did not match our records. Please double-check and try again.'
        })
      )
      .subscribe(
        () => {},
        () => {
          this.loginForm.get('passwordLogin').reset();
          this.passwordField.nativeElement.focus();
        }
      );
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', Validators.required]
    });
  }
}
