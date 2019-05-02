import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent implements OnInit {
  constructor(
    private afs: AngularFireStorage,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  value = {};

  ngOnInit() {}

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(file) {
    this.value = Array.from(file)[0];
  }

  remove() {
    this.value = {};
    this.cdr.detectChanges();
  }

  save() {
    from(
      this.afs.upload('userID', this.value, {
        contentType: this.value['type']
      })
    )
      .pipe(
        switchMap(res => res.ref.getDownloadURL()),
        switchMap(res => {
          return res;
        })
      )
      .subscribe(val => {
        console.log('val', val);
      });
  }
}
