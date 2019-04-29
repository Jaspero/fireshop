import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ConfirmationOptions} from './confirmation-options.interface';
import {Color} from '@jf/enums/color.enum';

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
    color: Color.Warm
  };

  options: ConfirmationOptions;

  ngOnInit() {
    this.options = {
      ...this.defaultOptions,
      ...(this.inputOptions || {})
    };
  }
}
