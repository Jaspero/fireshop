import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FilterModule} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';

@Component({
  selector: 'jms-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      options: FilterModule;
      collection: string;
      collectionName: string;
    },
    private dbService: DbService,
    private dialogRef: MatDialogRef<FilterDialogComponent>
  ) {}

  ngOnInit() {

  }
}
