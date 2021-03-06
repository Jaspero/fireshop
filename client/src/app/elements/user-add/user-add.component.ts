import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import firebase from 'firebase/app';
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
    private dbService: DbService,
    private cdr: ChangeDetectorRef
  ) { }

  @ViewChild('addDialog', {static: true})
  addDialogTemplate: TemplateRef<any>;
  roles$: Observable<Role[]>;
  form: FormGroup;
  type = 'password';

  ngOnInit() {
    this.roles$ = this.dbService.getDocumentsSimple(FirestoreCollection.Roles)
      .pipe(
        shareReplay(1)
      );
  }

  toggleType() {
    this.type = this.type === 'password' ? 'text' : 'password';
    this.cdr.markForCheck();
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

      return this.dbService.setDocument(
        'settings',
        'user',
        {
          roles: firebase.firestore.FieldValue.arrayUnion({
            email: data.email,
            role: data.role
          })
        },
        {
          merge: true
        }
      ).pipe(
        switchMap(() => {
          if (data.password) {
            return this.dbService
              .createUserAccount(data.email, data.password);
          }

          return of(true);
        }),
        notify({
          showThrownError: true
        }),
        tap(() => {
          this.dialog.closeAll();
        })
      );
    };
  }
}
