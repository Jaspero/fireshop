import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../../environments/environment';
import {notify} from '../../utils/notify.operator';

interface ImportResponse {
  errors?: any;
  created?: number;
}

enum ImportType {
  JSON = 'json',
  CSV = 'csv'
}

@Component({
  selector: 'jms-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  @ViewChild('overview', {static: true})
  overview: TemplateRef<any>;

  @ViewChild('dialog', {static: true})
  dialogTemplate: TemplateRef<any>;

  @Input()
  collection: string;

  @Input()
  schema: any;

  importType = ImportType;
  data: ImportResponse;
  form: FormGroup;

  selectFile(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    const form = this.form.getRawValue();

    formData.append('data', file, file.name);
    formData.append('collection', this.collection);
    formData.append('schema', JSON.stringify(this.schema));

    for (const key in form) {
      if (form.hasOwnProperty(key)) {
        formData.append(key, form[key]);
      }
    }

    this.http
      .post(`${environment.restApi}/importData`, formData)
      .pipe(
        notify({
          success: null,
          error: 'There was an error while importing data.'
        })
      )
      .subscribe((res: ImportResponse) => {
        this.data = res;
        this.dialog.open(this.overview, {
          width: '500px'
        });
      });
  }

  openDialog() {
    this.form = this.fb.group({
      type: ImportType.CSV,
      delimiter: ','
    });

    this.dialog.open(this.dialogTemplate, {
      width: '500px'
    });
  }
}
