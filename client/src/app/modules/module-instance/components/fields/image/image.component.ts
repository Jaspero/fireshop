import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {FormControl} from '@angular/forms';
import {from, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {StateService} from '../../../../../shared/services/state/state.service';
import {FieldData} from '../../../interfaces/field-data.interface';
import {GeneratedImage} from '../../../interfaces/generated-image.interface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {formatGeneratedImages} from '../../../utils/format-generated-images';
import {FieldComponent} from '../../field/field.component';

interface ImageData extends FieldData {
  preventServerUpload?: boolean;
  generatedImages?: GeneratedImage[];
}

@Component({
  selector: 'jms-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent extends FieldComponent<ImageData>
  implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: ImageData,
    private storage: AngularFireStorage,
    private cdr: ChangeDetectorRef,
    private state: StateService
  ) {
    super(cData);
  }

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  value: File;
  imageUrl: FormControl;
  disInput = false;

  ngOnInit() {
    this.imageUrl = new FormControl(this.cData.control.value);
    this.state.saveComponents.push(this);
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(el: HTMLInputElement) {
    this.value = Array.from(el.files)[0] as File;

    el.value = '';

    this.disInput = true;
    this.imageUrl.setValue(this.value.name);
  }

  remove() {
    this.imageUrl.setValue('');
    this.value = null;
    this.disInput = false;
    this.cdr.detectChanges();
  }

  save(moduleId: string, documentId: string) {
    if (this.value) {
      if (this.imageUrl.value && this.imageUrl.value !== this.value.name) {
        return of(this.imageUrl.value).pipe(
          tap(() => this.cData.control.setValue(this.imageUrl.value))
        );
      } else {
        return from(
          this.storage.upload(this.value.name, this.value, {
            contentType: this.value.type,
            customMetadata: {
              moduleId,
              documentId,
              ...(this.cData.generatedImages &&
                formatGeneratedImages(this.cData.generatedImages))
            }
          })
        ).pipe(
          switchMap(res => res.ref.getDownloadURL()),
          tap(url => this.cData.control.setValue(url))
        );
      }
    } else {
      this.cData.control.setValue(this.imageUrl.value);
      return of({});
    }
  }
}
