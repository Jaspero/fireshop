import {HttpClient} from '@angular/common/http';
import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {saveAs} from 'file-saver';
import {from} from 'rxjs';
import {finalize, switchMap} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {notify} from '../../utils/notify.operator';
import {queue} from '../../utils/queue.operator';
import {auth} from 'firebase/app';

enum ExportType {
  csv = 'csv',
  tab = 'tab',
  json = 'json',
  xls = 'xls'
}

@UntilDestroy()
@Component({
  selector: 'jms-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private data: {
      collection: string;
      ids?: string[];
    },
    private http: HttpClient,
    private sheetRef: MatBottomSheetRef<ExportComponent>
  ) {}

  types = ExportType;

  export(type) {
    const typeMap = {
      [ExportType.csv]: {fileType: 'csv', contentType: 'text/csv'},
      [ExportType.tab]: {fileType: 'csv', contentType: 'text/csv'},
      [ExportType.json]: {fileType: 'json', contentType: 'application/json'},
      [ExportType.xls]: {
        fileType: 'xls',
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    };

    from(
      auth().currentUser.getIdToken()
    )
      .pipe(
        switchMap(token =>
          this.http
            .post(
              `${environment.restApi}/cms-exportData`,
              {
                type,
                collection: this.data.collection,
                ...(this.data.ids && this.data.ids.length ? {ids: this.data.ids} : {})
              },
              {
                responseType: 'blob',
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
        ),
        queue(),
        notify({
          success: null,
          error: 'EXPORT.ERROR'
        }),
        finalize(() => this.sheetRef.dismiss()),
        untilDestroyed(this)
      )
      .subscribe(res => {
        saveAs(
          new Blob([res], {type: typeMap[type].contentType}),
          `${this.data.collection}.${typeMap[type].fileType}`
        );
      });
  }
}
