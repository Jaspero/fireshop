import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireStorage, StorageBucket} from '@angular/fire/storage';
import * as firebase from 'firebase';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent, FieldData} from '../../field/field.component';

interface ImageData extends FieldData {
  allowUrl?: boolean;
  allowServerUpload?: boolean;
}

@Component({
  selector: 'jms-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: StorageBucket, useValue: 'my-bucket-name'}]
})
export class ImageComponent extends FieldComponent<ImageData>
  implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: ImageData,
    private storage: AngularFireStorage
  ) {
    super(cData);
  }

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  value: File;

  ngOnInit() {
    this.cData.control.setValue('');
  }

  openFilesUploader() {
    this.fileEl.nativeElement.click();
  }

  urlUploader() {
    console.log(this.cData.control.value);
  }

  filesUploader(file) {
    this.value = Array.from(file)[0] as File;
    from(this.storage.upload(this.value.name, this.value)).pipe(
      switchMap(res => res.ref.getDownloadURL())
    );
  }
}
