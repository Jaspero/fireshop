import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../../integrations/firebase/firestore-collection.enum';
import {DbService} from '../../services/db/db.service';
import {StateService} from '../../services/state/state.service';
import {notify} from '../../utils/notify.operator';

@Component({
  selector: 'jms-layout-settings',
  templateUrl: './layout-settings.component.html',
  styleUrls: ['./layout-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSettingsComponent implements OnInit {
  constructor(
    private state: StateService,
    private dbService: DbService,
    private dialogRef: MatDialogRef<LayoutSettingsComponent>
  ) { }

  value$: Observable<FormControl>;

  ngOnInit() {
    this.value$ = this.state.layout$
      .pipe(
        take(1),
        map(value => new FormControl(value))
      );
  }

  save(control: FormControl) {
    return () =>
      this.dbService.setDocument(
        FirestoreCollection.Settings,
        'layout',
        control.value
      )
        .pipe(
          notify(),
          tap(() =>
            this.dialogRef.close()
          )
        );
  }
}
