import {ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {functions} from 'firebase';
import {from} from 'rxjs';
import {notify} from '../../shared/utils/notify.operator';
import {RepeatPasswordValidator} from '../../shared/validators/repeat-password.validator';

@Component({
  selector: 'jms-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  @ViewChild('dg', {static: true})
  passwordDialog: TemplateRef<any>;

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group(
      {
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      },
      {
        validator: RepeatPasswordValidator('Passwords not matching')
      }
    );
  }

  openDialog() {
    this.dialog.open(
      this.passwordDialog,
      {
        width: '600px'
      }
    )
  }

  change() {
    return () => {
      const {password} = this.form.getRawValue();
      const {id} = this.el.nativeElement.dataset;
      const func = functions().httpsCallable('cms-updateUser');

      return from(func({id, password}))
        .pipe(
          notify({
            success: 'Password updated successfully',
            error: 'There was an error sending the request'
          })
        )
    }
  }
}
