import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {from, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {GeneratedImage} from '../../../interfaces/generated-image.interface';
import {formatGeneratedImages} from '../../../utils/format-generated-images';

@Component({
  selector: 'jfsc-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent implements ControlValueAccessor {
  constructor(
    private afs: AngularFireStorage,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  @Input()
  placeholder = 'Image URL';

  value: File;
  imageUrl = new FormControl('');
  disInput = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value: string) {
    if (value) {
      this.imageUrl.setValue(value);
    }
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(el: HTMLInputElement) {
    this.value = Array.from(el.files)[0] as File;
    el.value = '';
    this.disInput = true;
    this.imageUrl.setValue(this.value['name']);
  }

  remove() {
    this.imageUrl.setValue('');
    this.value = null;
    this.disInput = false;
    this.cdr.detectChanges();
  }

  save(
    moduleId: string,
    documentId: string,
    generatedImages?: GeneratedImage[]
  ) {
    if (this.value) {
      if (this.imageUrl.value && this.imageUrl.value !== this.value.name) {
        return of(this.imageUrl.value).pipe(
          tap(() => this.onChange(this.imageUrl.value))
        );
      } else {
        const name = [moduleId, documentId, this.value.name].join('-');
        return from(
          this.afs.upload(name, this.value, {
            contentType: this.value.type,
            customMetadata: {
              moduleId,
              documentId,
              ...(generatedImages && formatGeneratedImages(generatedImages))
            }
          })
        ).pipe(
          switchMap(res => res.ref.getDownloadURL()),
          tap(url => this.onChange(url))
        );
      }
    } else {
      return of({});
    }
  }
}
