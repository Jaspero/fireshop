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
import {from, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {StateService} from '../../../../../shared/services/state/state.service';
import {FieldData} from '../../../interfaces/field-data.interface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent} from '../../field/field.component';

interface FileData extends FieldData {
  emptyLabel?: string;
  preventClear?: boolean;
}

@Component({
  selector: 'jms-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent extends FieldComponent<FileData> implements OnInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: FileData,
    private storage: AngularFireStorage,
    private cdr: ChangeDetectorRef,
    private state: StateService
  ) {
    super(cData);
  }

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  value: File;
  name: string;
  emptyLabel: string;

  ngOnInit() {

    if (this.cData.control.value) {
      this.name = this.cData.control.value;
    }

    this.emptyLabel = this.cData.hasOwnProperty('emptyLabel') ? this.cData.emptyLabel : 'FIELDS.FILE.EMPTY';

    this.state.saveComponents.push(this);
  }

  fileChange(ev: Event) {
    const el = ev.target as HTMLInputElement;
    this.value = Array.from(el.files)[0] as File;
    if (this.value) {
      this.name = this.value.name;
    }
    el.value = '';
  }

  clear() {
    this.name = '';
    this.cData.control.setValue('');
  }

  save(moduleId: string, documentId: string) {
    if (this.value) {
      const name = [
        moduleId,
        documentId,
        this.value.name
      ]
        .join('-');

      return from(
        this.storage.upload(name, this.value, {
          contentType: this.value.type,
          customMetadata: {
            moduleId,
            documentId
          }
        })
      ).pipe(
        switchMap(res => res.ref.getDownloadURL()),
        tap(url => this.cData.control.setValue(url))
      );
    } else {
      return of({});
    }
  }
}
