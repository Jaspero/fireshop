import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {readFile} from '@jf/utils/read-file';
import {forkJoin, from} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent implements OnInit {
  constructor(private afs: AngularFireStorage) {}

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  value = '';

  ngOnInit() {}

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(file) {
    const fileToUpload = Array.from(file)[0];
    console.log('fileToUpload1111', fileToUpload);
    const mama = from(
      this.afs.upload('userID', fileToUpload, {
        contentType: fileToUpload['type']
      })
    );
    console.log('mama', mama);
  }

  save() {}
}
