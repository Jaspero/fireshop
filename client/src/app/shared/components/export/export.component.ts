import {HttpClient} from '@angular/common/http';
import {Component, Inject} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import {RxDestroy} from '@jaspero/ng-helpers';
import {saveAs} from 'file-saver';
import {finalize, takeUntil} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {notify} from '../../utils/notify.operator';

enum ExportType {
  csv = 'csv',
  tab = 'tab',
  json = 'json',
  xls = 'xls'
}

@Component({
  selector: 'jms-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent extends RxDestroy {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private data: {
      collection: string;
      ids?: string[];
    },
    private http: HttpClient,
    private sheetRef: MatBottomSheetRef<ExportComponent>
  ) {
    super();
  }

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

    this.http
      .post(
        `${environment.restApi}/exportData`,
        {
          type,
          collection: this.data.collection,
          ...(this.data.ids && this.data.ids.length ? {ids: this.data.ids} : {})
        },
        {
          responseType: 'blob'
        }
      )
      .pipe(
        notify({
          success: null,
          error: `Unknown export error`
        }),
        finalize(() => this.sheetRef.dismiss()),
        takeUntil(this.destroyed$)
      )
      .subscribe(res => {
        saveAs(
          new Blob([res], {type: typeMap[type].contentType}),
          `${this.data.collection}.${typeMap[type].fileType}`
        );
      });
  }
}
