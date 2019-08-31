import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RxDestroy} from '@jaspero/ng-helpers';
import {concat, forkJoin, Observable} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../integrations/firebase/firestore-collection.enum';
import {Role} from '../../shared/enums/role.enum';
import {Settings} from '../../shared/interfaces/settings.interface';
import {DbService} from '../../shared/services/db/db.service';
import {notify} from '../../shared/utils/notify.operator';

interface User {
  id?: string;
  email: string;
  role: string;
  providerData: any;
}

@Component({
  selector: 'jms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent extends RxDestroy implements OnInit {
  constructor(
    private dbService: DbService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  role = Role;
  form: FormGroup;
  settings: Settings;
  users: User[];
  columns = ['exists', 'email', 'role', 'providerData', 'actions'];

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: '',
      role: Role.Read
    });

    forkJoin(
      this.dbService.getUserSettings(),
      this.dbService.getDocuments(FirestoreCollection.Admins)
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([settings, adminUsers]) => {
        this.settings = settings;

        this.users = settings.roles.map(role => {
          const account = adminUsers.find(acc => acc.id === role.email);

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
      this.settings.roles.splice(
        this.settings.roles.findIndex(it => it.email === user.email),
        1
      );

      this.users.splice(this.users.findIndex(it => it.email === user.email), 1);

      const toExec = [this.dbService.updateUserSettings(this.settings)];

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

  add() {
    return () => {
      const data = this.form.getRawValue();

      let newUser: any = {
        email: data.email,
        role: data.role
      };

      this.settings.roles.push(newUser);

      const toExec: Array<Observable<any>> = [
        this.dbService.updateUserSettings(this.settings)
      ];

      if (data.password) {
        toExec.push(
          this.dbService.createUserAccount(data.email, data.password).pipe(
            tap(({id}) => {
              newUser = {
                ...newUser,
                id
              };
            })
          )
        );
      }

      return concat(toExec).pipe(
        notify(),
        tap(() => {
          this.users = [newUser, ...this.users];
          this.cdr.detectChanges();
        })
      );
    };
  }
}
