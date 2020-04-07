import {ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ReactiveFormsModule} from '@angular/forms';
import {GalleryUploadComponent} from './gallery-upload/gallery-upload.component';
import {ImageUploadComponent} from './image-upload/image-upload.component';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {LoadClickModule} from '@jaspero/ng-helpers';

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

    AngularFireStorageModule,
    LoadClickModule
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
