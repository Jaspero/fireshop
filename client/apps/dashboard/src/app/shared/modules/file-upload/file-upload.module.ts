import {ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {FileUploadComponent} from './component/file-upload.component';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ReactiveFormsModule} from '@angular/forms';

const COMPONENTS = [FileUploadComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,

    AngularFireStorageModule
  ],
  exports: [...COMPONENTS]
})
export class FileUploadModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FileUploadModule
    };
  }
}
