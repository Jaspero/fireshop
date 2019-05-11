import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {notify} from '@jf/utils/notify.operator';
import {auth, firestore, User} from 'firebase';
import {from} from 'rxjs';
import {filter, map, skip, switchMap, take, takeUntil} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {RepeatPasswordValidator} from '../../helpers/compare-passwords';
import {StateService} from '../../services/state/state.service';

export enum LoginSignUpView {
  LogIn,
  SignUp,
  Reset
}

@Component({
  selector: 'jfs-login-signup-dialog',
  templateUrl: './login-signup-dialog.component.html',
  styleUrls: ['./login-signup-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginSignupDialogComponent extends RxDestroy implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LoginSignupDialogComponent>,
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private state: StateService,
    @Inject(MAT_DIALOG_DATA)
    private options: {view: LoginSignUpView}
  ) {
    super();
  }

  @ViewChild('password') passwordField: ElementRef;

  logInForm: FormGroup;
  resetPasswordControl: FormControl;
  signUpForm: FormGroup;
  view = LoginSignUpView;
  currentView: LoginSignUpView = LoginSignUpView.LogIn;

  validation = {
    [LoginSignUpView.LogIn]: (
      docRef: AngularFirestoreDocument<Customer>,
      doc: firestore.DocumentSnapshot
    ) => {
      if (doc.exists) {
        this.state.logInValid$.next(true);
        this.dialogRef.close();
        this.snackBar.open('You are now logged in!', 'Dismiss', {
          duration: 2500
        });
      } else {
        this.afAuth.auth.signOut();
        this.snackBar.open(
          'You do not have an account.Please sign up first!',
          'Dismiss',
          {
            duration: 2500
          }
        );
        this.connectListener();
      }
    },
    [LoginSignUpView.SignUp]: (
      docRef: AngularFirestoreDocument<Customer>,
      doc: firestore.DocumentSnapshot,
      user: User
    ) => {
      this.state.logInValid$.next(true);
      if (doc.exists) {
        this.snackBar.open('Logged in with existing account', 'Dismiss', {
          duration: 2500
        });
      } else {
        // TODO: Map for different providers
        const signUpData: any = {
          createdOn: Date.now(),
          email: user.email
        };

        if (user.displayName) {
          signUpData.name = user.displayName;
        }

        if (user.photoURL) {
          signUpData.profileImage = user.photoURL;
        }

        from(docRef.set(signUpData))
          .pipe(
            notify({
              success: 'You are now logged in',
              error: 'Invalid'
            })
          )
          .subscribe();
      }

      this.dialogRef.close();
    }
  };

  ngOnInit() {
    /**
     * If a user opens this dialog we
     * know he isn't logged in
     */
    this.state.logInValid$.next(false);

    if (this.options && this.options.hasOwnProperty('view')) {
      this.currentView = this.options.view;
    }

    this.buildForms();
    this.connectListener();
  }

  logInWithGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  // Todo: login is not working now because Facebook does not allow to use localhost's domain and must connect with Jaspero's facebook
  logInWithFacebook() {
    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  // Todo: must connect Firestore with Twitter
  logInWithTwitter() {
    this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
  }

  logInWithInstagram() {
    window.open(
      `${environment.restApi}/instagram/redirect`,
      'firebaseAuth',
      'height=315,width=400'
    );
  }

  signUpWithEmail() {
    const data = this.signUpForm.getRawValue();

    from(
      this.afAuth.auth.createUserWithEmailAndPassword(
        data.email,
        data.pg.password
      )
    )
      .pipe(
        switchMap(() => {
          return this.afAuth.auth.signInWithEmailAndPassword(
            data.email,
            data.pg.password
          );
        }),
        notify({
          success: 'Your account is successfully created',
          error: 'Your email is invalid or already in use'
        })
      )
      .subscribe();
  }

  loginWithEmail() {
    const dataLogin = this.logInForm.getRawValue();

    from(
      this.afAuth.auth.signInWithEmailAndPassword(
        dataLogin.email,
        dataLogin.password
      )
    )
      .pipe(
        notify({
          success: 'You are now logged in',
          error: 'The email and password you entered did not match our records.'
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        () => {},
        () => {
          this.logInForm.get('password').reset();
          this.passwordField.nativeElement.focus();
        }
      );
  }

  resetPassword() {
    from(
      this.afAuth.auth.sendPasswordResetEmail(this.resetPasswordControl.value)
    )
      .pipe(notify())
      .subscribe(
        () => {
          this.dialogRef.close();
        },
        () => {
          this.resetPasswordControl.value.reset();
        }
      );
  }

  toggleState(newView: LoginSignUpView) {
    this.currentView = newView;
  }

  private buildForms() {
    this.logInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pg: this.fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(6)]],
          repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
        },
        {validator: RepeatPasswordValidator('Passwords not matching')}
      )
    });

    this.resetPasswordControl = this.fb.control('', [
      Validators.required,
      Validators.email
    ]);
  }

  private connectListener() {
    let docRef: AngularFirestoreDocument<Customer>;

    this.afAuth.user
      .pipe(
        skip(1),
        filter(user => !!user),
        switchMap(user => {
          docRef = this.afs.doc(
            `${FirestoreCollections.Customers}/${user.uid}`
          );
          return docRef.get({source: 'server'}).pipe(map(doc => ({doc, user})));
        }),
        take(1),
        takeUntil(this.destroyed$)
      )
      .subscribe(res => {
        this.validation[this.currentView](docRef, res.doc, res.user);
      });
  }
}
