import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import firebase from 'firebase/app';
import {combineLatest, from, Observable, throwError} from 'rxjs';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../../../../../integrations/firebase/firestore-collection.enum';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {confirmation} from '../../../../../../shared/utils/confirmation';
import {notify} from '../../../../../../shared/utils/notify.operator';
import {RepeatPasswordValidator} from '../../../../../../shared/validators/repeat-password.validator';

@Component({
  selector: 'jms-profile-security',
  templateUrl: './profile-security.component.html',
  styleUrls: ['./profile-security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSecurityComponent implements OnInit {
  constructor(
    private state: StateService,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router,
    private db: DbService
  ) { }

  multipleProviders$: Observable<boolean>;
  passwordProvider$: Observable<any>;
  googleProvider$: Observable<any>;
  hasTwoFactor$: Observable<boolean>;

  pwForm: FormGroup;
  emailForm: FormGroup;

  ngOnInit() {

    this.emailForm = this.fb.group({
      email: [this.state.user.email || '', [Validators.required, Validators.email]]

    });

    this.multipleProviders$ = this.afAuth.user
      .pipe(
        map(item => item?.providerData?.length > 1)
      );

    this.hasTwoFactor$ = this.afAuth.user
      .pipe(
        map(user =>
          !!(user.multiFactor?.enrolledFactors?.length)
        )
      );

    this.googleProvider$ = this.afAuth.user
      .pipe(
        map(item =>
          (item?.providerData || [])
            .find(it => it.providerId === 'google.com')
        )
      );

    this.passwordProvider$ = this.afAuth.user
      .pipe(
        map(item =>
          (item.providerData || [])
            .find(it => it.providerId === 'password')
        )
      );

    this.pwForm = this.fb.group({
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      },
      {
        validator: RepeatPasswordValidator(`Passwords don't match`)
      });
  }

  changePassword(form: FormGroupDirective) {
    return () =>
      from(
        firebase.auth()
          .currentUser
          .updatePassword(this.pwForm.get('password').value)
      )
        .pipe(
          catchError(err => {
            let message;

            if (err.code === 'auth/requires-recent-login') {
              message = 'For security reasons please login to your account again before changing your password.';
              firebase.auth()
                .signOut()
                .then(() =>
                  this.router.navigate(['/login'])
                );
            }

            return throwError({
              error: {
                message
              }
            });
          }),
          notify({
            success: 'Your password has been updated successfully'
          }),
          tap(() => {
            form.reset();
          })
        );
  }

  changeEmail() {
    return () => {

      const {email} = this.emailForm.getRawValue();

      return combineLatest([
        this.db.setDocument(
          FirestoreCollection.Users,
          this.state.user.id,
          {email},
          {merge: true}
        ),
        from(
          firebase.auth()
            .currentUser
            .updateEmail(email)
        )
          .pipe(
            catchError(err => {
              let message;

              if (err.code === 'auth/requires-recent-login') {
                message = 'For security reasons please login to your account again before changing your email.';
                firebase.auth()
                  .signOut()
                  .then(() =>
                    this.router.navigate(['/login'])
                  );
              }

              return throwError({
                error: {
                  message
                }
              });
            })
          )
      ])
        .pipe(
          notify({
            success: 'Your email has been updated successfully'
          })
        )
    };
  }

  removeAccount() {
    confirmation(
      [
        switchMap(() => from(firebase.auth().currentUser.delete())),
        catchError(error => {
          if (error.code === 'auth/requires-recent-login') {
            firebase.auth().signOut();
            this.router.navigate(['/login']);
          }

          return throwError({
            error: {
              message:
                'For security reasons, please login again before removing your account.'
            }
          });
        }),
        notify({
          success: 'Your account and all of your personal information have been removed from our system.'
        }),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ],
      {
        header: 'Are you sure you want to remove your account?',
        description:
          'This action is permanent and can not be reverted. Your account and all of your personal information will be removed from our system.'
      }
    );
  }

  removeProvider(provider: string) {
    confirmation(
      [
        switchMap(() =>
          firebase.auth()
            .currentUser
            .unlink(provider)
        ),
        notify({
          success: 'Your account has been successfully unlinked.'
        }),
      ],
      {
        header: 'Are you sure you want to unlink this authentication method?',
        description:
          'This action is permanent and can not be reverted. You would need to link your account again in order to be able to use this authentication method.'
      }
    )
  }

  toggleTwoFactor() {
    return () => {

      let htf: boolean;

      return this.hasTwoFactor$
        .pipe(
          take(1),
          switchMap((hasTwoFactor) => {
            htf = hasTwoFactor;
            return this.afAuth.user
              .pipe(
                take(1),
                switchMap(user =>
                  from(
                    hasTwoFactor ?
                      user.multiFactor.unenroll(user.multiFactor.enrolledFactors.pop()) :
                      user.sendEmailVerification({url: `${location.origin}/mfa`})
                  )
                ),
                catchError(e => {
                  if (e.code === 'auth/requires-recent-login') {
                    this.router.navigate(['/login']);
                    this.afAuth.signOut();
                  }

                  return throwError(e);
                }),
                notify({
                  success: htf ? 'PROFILE.REMOVE_MFA' : 'PROFILE.CONNECT_MFA',
                  showThrownError: true
                })
              );
          })
        )
    }
  }
}
