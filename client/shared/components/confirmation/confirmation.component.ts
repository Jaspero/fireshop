import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {Color} from '../../../apps/shop/src/app/shared/enums/color.enum';
import {ConfirmationOptions} from './confirmation-options.interface';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'jfs-confrimation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public inputOptions: Partial<ConfirmationOptions>
  ) {}

  defaultOptions: ConfirmationOptions = {
    header: 'Are you sure?',
    confirm: 'Remove',
    negate: 'Cancel',
    color: Color.Warn
  };

  options: ConfirmationOptions;

  ngOnInit() {
    this.options = {
      ...this.defaultOptions,
      ...(this.inputOptions || {})
    };
  }
}
