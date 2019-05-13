import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'jfsc-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  @ViewChild('file') fileEl: ElementRef<HTMLInputElement>;
  @ViewChild('overview') overview: TemplateRef<any>;

  @Input()
  collection: string;

  data: any;

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
      .subscribe((val: {errors: any}) => {
        this.data = val;
        this.cdr.detectChanges();
        this.dialog.open(this.overview, {
          width: '500px'
        });
      });
  }
}
