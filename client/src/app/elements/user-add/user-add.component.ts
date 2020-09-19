import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {firestore} from 'firebase/app';
import {Observable, of} from 'rxjs';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../integrations/firebase/firestore-collection.enum';
import {Role} from '../../shared/interfaces/role.interface';
import {DbService} from '../../shared/services/db/db.service';
import {notify} from '../../shared/utils/notify.operator';
import {randomPassword} from '../../shared/utils/random-password';

@Component({
  selector: 'jms-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAddComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dbService: DbService
  ) { }

  @ViewChild('addDialog', {static: true})
  addDialogTemplate: TemplateRef<any>;
  roles$: Observable<Role[]>;
  form: FormGroup;

  ngOnInit() {
    this.roles$ = this.dbService.getDocumentsSimple(FirestoreCollection.Roles)
      .pipe(
        shareReplay(1)
      );
  }

  generateRandomPassword() {
    this.form.get('password').setValue(randomPassword());
  }

  open() {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      role: ''
    });

    this.dialog.open(
      this.addDialogTemplate,
      {
        width: '600px'
      }
    )
  }

  add() {
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
          roles: firestore.FieldValue.arrayUnion(newUser)
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
                tap((dt: any) => {
                  newUser = {
                    ...newUser,
                    id: dt.data.id
                  };
                })
              );
          }

          return of(true);
        }),
        notify(),
        tap(() => {
          this.dialog.closeAll();
        })
      );
    };
  }
}
