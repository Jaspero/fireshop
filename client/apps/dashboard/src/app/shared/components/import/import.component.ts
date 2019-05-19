import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {notify} from '@jf/utils/notify.operator';
import {environment} from '../../../../environments/environment';

interface ImportResponse {
  errors?: any;
  created?: number;
}

@Component({
  selector: 'jfsc-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  @ViewChild('file') fileEl: ElementRef<HTMLInputElement>;
  @ViewChild('overview') overview: TemplateRef<any>;

  @Input()
  collection: string;

  data: ImportResponse;

  selectFile(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.http
      .post(`${environment.restApi}/importData`, formData, {
        params: {
          collection: this.collection
        }
      })
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
}
