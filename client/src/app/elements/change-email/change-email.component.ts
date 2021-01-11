import {Component, OnInit, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {tap} from 'rxjs/operators';
import {DbService} from '../../shared/services/db/db.service';
import {notify} from '../../shared/utils/notify.operator';

@Component({
  selector: 'jms-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeEmailComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dbService: DbService
  ) { }

  @ViewChild('dg', { static: true })
  emailDialog: TemplateRef<any>;

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]]
      }
    );
  }

  openDialog() {
    this.dialog.open(
      this.emailDialog,
      {
        width: '600px'
      }
    )
  }

  change() {
    return () => {
      const { email } = this.form.getRawValue();
      const { id } = this.el.nativeElement.dataset;

      return this.dbService.callFunction('cms-updateEmail', { id, email })
        .pipe(
          notify({
            success: 'Email updated successfully',
            error: 'There was an error sending the request'
          }),
          tap(() => {
            this.dialog.closeAll();
          })
        )
    }
  }
}
