import {ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ReactiveFormsModule} from '@angular/forms';
import {GalleryUploadComponent} from './gallery-upload/gallery-upload.component';
import {ImageUploadComponent} from './image-upload/image-upload.component';

const COMPONENTS = [GalleryUploadComponent, ImageUploadComponent];

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
