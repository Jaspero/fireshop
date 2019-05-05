import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {FormControl} from '@angular/forms';
import {from, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {
  constructor(
    private afs: AngularFireStorage,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  @Input()
  placeholder = 'Image URL';

  value: File;
  imageUrl = new FormControl('');
  disInput = false;

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(file) {
    this.value = Array.from(file)[0] as File;
    this.disInput = true;
    this.imageUrl.setValue(this.value['name']);
  }

  remove() {
    this.imageUrl.setValue('');
    this.value = null;
    this.disInput = false;
    this.cdr.detectChanges();
  }

  save() {
    if (this.imageUrl.value && this.imageUrl.value !== this.value.name) {
      return of(this.imageUrl.value);
    } else {
      return from(
        this.afs.upload(this.value.name, this.value, {
          contentType: this.value.type
        })
      ).pipe(switchMap(res => res.ref.getDownloadURL()));
    }
  }
}
