import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'jfs-update-available',
  templateUrl: './update-available.component.html',
  styleUrls: ['./update-available.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateAvailableComponent {
  constructor(public snackBar: MatSnackBar) {}

  reload() {
    location.reload();
  }

  close() {
    this.snackBar.dismiss();
  }
}
