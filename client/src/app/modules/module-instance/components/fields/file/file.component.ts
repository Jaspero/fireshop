import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {StateService} from '../../../../../shared/services/state/state.service';
import {FieldData} from '../../../interfaces/field-data.interface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent} from '../../field/field.component';

interface FileData extends FieldData {
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

  ngOnInit() {
  }

  fileChange(el: HTMLInputElement) {
    this.value = Array.from(el.files)[0] as File;
    el.value = '';
  }
}
