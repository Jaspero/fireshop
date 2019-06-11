import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {from, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {FirestoreCollection} from '../../shared/enums/firestore-collection.enum';
import {Role} from '../../shared/enums/role.enum';
import {Settings} from '../../shared/interfaces/settings.interface';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  role = Role;
  form$: Observable<FormGroup>;

  ngOnInit() {
    this.form$ = this.afs
      .collection(FirestoreCollection.Settings)
      .doc<Settings>('user')
      .valueChanges()
      .pipe(
        take(1),
        map(value =>
          this.fb.group({
            roles: this.fb.array(
              value.roles.map(role =>
                this.fb.group({
                  email: [role.email, [Validators.required, Validators.email]],
                  role: [role.role, Validators.required]
                })
              )
            )
          })
        )
      );
  }

  rolesForm(form: FormGroup) {
    return form.get('roles') as FormArray;
  }

  add(form: FormGroup) {
    this.rolesForm(form).push(
      this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        role: [Role.Read, Validators.required]
      })
    );
  }

  save(form) {
    return () => {
      return from(
        this.afs
          .collection(FirestoreCollection.Settings)
          .doc('user')
          .update(form.getRawValue())
      ).pipe(notify());
    };
  }
}
