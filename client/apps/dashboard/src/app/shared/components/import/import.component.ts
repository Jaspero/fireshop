import {HttpClient} from '@angular/common/http';
import {isNewLine} from '@angular/compiler/src/chars';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'jfsc-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent implements OnInit {
  constructor(private http: HttpClient) {}

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  ngOnInit() {}

  selectFile(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.http
      .post(`${environment.restApi}/importData`, formData)
      .subscribe(val => {
        const mama = val.fileData.split(/\r?\n/);
        console.log('val', mama);
      });
  }
}
