import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'jfsc-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent {
  constructor(private http: HttpClient) {}

  @Output()
  importedData = new EventEmitter<any>();

  @Input()
  collection: any;

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

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
        this.importedData.emit(val);
      });
  }
}
