import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Role} from '../../shared/enums/role.enum';
import {DbService} from '../../shared/services/db/db.service';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  constructor(private dbService: DbService, private fb: FormBuilder) {}

  role = Role;
  form$: Observable<FormGroup>;

  ngOnInit() {
    this.form$ = this.dbService.getUserSettings().pipe(
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
      return this.dbService
        .updateUserSettings(form.getRawValue())
        .pipe(notify());
    };
  }
}
