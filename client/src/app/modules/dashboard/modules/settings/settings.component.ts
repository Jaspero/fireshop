import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {forkJoin, Observable, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../../../integrations/firebase/firestore-collection.enum';
import {environment} from '../../../../../environments/environment';
import {FilterMethod} from '../../../../shared/enums/filter-method.enum';
import {Role} from '../../../../shared/interfaces/role.interface';
import {Settings} from '../../../../shared/interfaces/settings.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {randomPassword} from '../../../../shared/utils/random-password';
import {User} from '../../../../shared/interfaces/user.interface';
import {AvailableLangs, TranslocoService} from '@ngneat/transloco';
import {StateService} from '../../../../shared/services/state/state.service';

@UntilDestroy()
@Component({
  selector: 'jms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  constructor(
    private dbService: DbService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private transloco: TranslocoService,
    private state: StateService
  ) {}

  form: FormGroup;
  settings: Settings;
  users: User[];
  columns = ['exists', 'email', 'role', 'providerData', 'actions'];
  timeStamp = environment.timeStamp;
  roles$: Observable<Role[]>;
  availableLanguages: AvailableLangs;
  languageControl: FormControl;

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      role: ''
    });

    this.availableLanguages = this.transloco.getAvailableLangs();
    this.languageControl = new FormControl(this.state.language, [Validators.required]);
    this.languageControl.valueChanges.pipe(
      tap((language) => {
        this.transloco.setActiveLang(language);
        this.state.language = language;
        localStorage.setItem('language', language);
      }),
      untilDestroyed(this)
    ).subscribe();

    this.roles$ = this.dbService.getDocumentsSimple(FirestoreCollection.Roles);

    this.dbService.getDocument(`settings`, 'user')
      .pipe(
        switchMap(({roles}) => {
          return forkJoin([
            of(roles),
            ...roles.map(role =>
              this.dbService.getDocuments('users', 1, null, null, [{
                key: 'email',
                value: role.email,
                operator: FilterMethod.Equal
              }])
            )
          ]);
        }),
        untilDestroyed(this)
      )
      .subscribe(([roles, ...users]: any) => {

        users = users.map(it => it[0] ? {...it[0].data(), id: it[0].id} : null);

        this.users = roles.map(role => {
          const account = users.find(acc => acc && acc.email === role.email);

          return {
            id: account ? account.id : null,
            role: role.role,
            email: role.email,
            providerData: account ? account.providerData : []
          };
        });

        this.cdr.detectChanges();
      });
  }

  remove(user: User) {
    return () => {
      this.users.splice(this.users.findIndex(it => it.email === user.email), 1);

      const toExec = [this.dbService.setDocument(
        'settings',
        'user',
        {
          roles: this.users.map(({role, email}) => ({role, email}))
        },
        {
          merge: true
        }
      )];

      if (user.id) {
        toExec.push(this.dbService.removeUserAccount(user.id));
      }

      return forkJoin(toExec).pipe(
        notify(),
        tap(() => {
          this.users = [...this.users];
          this.cdr.detectChanges();
        })
      );
    };
  }

  generateRandomPassword() {
    this.form.get('password').setValue(randomPassword());
  }

  add(form: FormGroupDirective) {
    return () => {
      const data = this.form.getRawValue();

      let newUser: any = {
        email: data.email,
        role: data.role
      };

      return this.dbService.setDocument(
        'settings',
        'user',
        {
          roles: [
            newUser,
            ...this.users.map(({role, email}) => ({role, email}))
          ]
        },
        {
          merge: true
        }
      ).pipe(
        switchMap(() => {
          if (data.password) {
            return this.dbService
              .createUserAccount(data.email, data.password)
              .pipe(
                tap(dt => {
                  newUser = {
                    ...newUser,
                    id: dt.id
                  };
                })
              );
          }

          return of(true);
        }),
        notify(),
        tap(() => {
          this.users = [newUser, ...this.users];
          form.resetForm();
          this.cdr.detectChanges();
        })
      );
    };
  }

  edit(user: User) {
    this.router.navigate(['/m/users/single/', user.id]);
  }
}
