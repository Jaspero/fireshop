import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  MatBottomSheetModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {
  ClickOutsideModule,
  EnumKeyFormatModule,
  EnumModule,
  FormTouchOnHoverModule,
  SanitizeModule,
  StopPropagationModule
} from '@jaspero/ng-helpers';
import {ColorPickerComponent} from '@jf/components/color-picker/color-picker.component';
import {ExportComponent} from './components/export/export.component';
import {LangListComponent} from './components/lang-list/lang-list.component';
import {ListComponent} from './components/list/list.component';
import {WysiwygComponent} from './components/wysiwyg/wysiwyg.component';
import {ConfirmationComponent} from '@jf/components/confirmation/confirmation.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FileUploadModule} from './modules/file-upload/file-upload.module';
import {HttpClientModule} from '@angular/common/http';
import { ChipsComponent } from './components/chips/chips.component';

const IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,

  // Material
  MatFormFieldModule,
  MatSelectModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatSnackBarModule,
  MatDialogModule,
  MatInputModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatBottomSheetModule,
  DragDropModule,
  MatCardModule,
  MatDividerModule,
  MatTooltipModule,
  MatDividerModule,
  MatTabsModule,
  MatMenuModule,
  MatChipsModule,
  MatToolbarModule,
  MatProgressBarModule,

  // AngularFire
  AngularFirestoreModule,
  AngularFireAuthModule,

  // https://github.com/Jaspero/ng-helpers
  FormTouchOnHoverModule,
  StopPropagationModule,
  ClickOutsideModule,
  EnumModule,
  EnumKeyFormatModule,
  SanitizeModule,

  FileUploadModule
];

const COMPONENTS = [
  WysiwygComponent,
  ChipsComponent
];

const ENTRY_COMPONENTS = [
  ConfirmationComponent,
  ExportComponent,
  ColorPickerComponent,
  ListComponent,
  LangListComponent
];

@NgModule({
  declarations: [...ENTRY_COMPONENTS, ...COMPONENTS],
  imports: [...IMPORTS],
  exports: [...IMPORTS, ...COMPONENTS],
  entryComponents: ENTRY_COMPONENTS,
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class SharedModule {}
