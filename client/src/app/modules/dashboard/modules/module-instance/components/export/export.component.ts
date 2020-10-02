import {HttpClient} from '@angular/common/http';
import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {saveAs} from 'file-saver';
import {auth} from 'firebase/app';
import {from} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {FilterModule} from '../../../../../../shared/interfaces/filter-module.interface';
import {InstanceSort} from '../../../../../../shared/interfaces/instance-sort.interface';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {notify} from '../../../../../../shared/utils/notify.operator';
import {queue} from '../../../../../../shared/utils/queue.operator';

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
export class ExportComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private data: {
      filterModule?: FilterModule,
      filterValue?: any,
      sort?: InstanceSort,
      collection: string;
      ids?: string[];
    },
    private http: HttpClient,
    private sheetRef: MatBottomSheetRef<ExportComponent>,
    private dialog: MatDialog,
    private db: DbService,
    private fb: FormBuilder
  ) {}

  @ViewChild('options', {static: true})
  optionsTemplate: TemplateRef<any>;

  types = ExportType;
  type: ExportType;
  form: FormGroup;

  selectType(type: ExportType) {
    this.type = type;
    this.dialog.open(
      this.optionsTemplate,
      {
        width: '600px'
      }
    )
  }

  export() {
    return () => {
      const type = this.type;
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

      return from(
        auth().currentUser.getIdToken()
      )
        .pipe(
          switchMap(token =>
            this.http
              .post(
                this.db.url('cms-exportData/' + this.data.collection),
                {
                  type,
                  collection: this.data.collection,
                  ...this.data.sortM
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
          tap((res) => {

            saveAs(
              new Blob([res], {type: typeMap[type].contentType}),
              `${this.data.collection}.${typeMap[type].fileType}`
            );

            this.sheetRef.dismiss()
          })
        )
    }
  }
}
