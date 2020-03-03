import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  MatAutocompleteModule,
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
  MatRadioModule,
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
  LoadClickModule,
  SanitizeModule,
  StopPropagationModule
} from '@jaspero/ng-helpers';
import {ColorPickerComponent} from '@jf/components/color-picker/color-picker.component';
import {ConfirmationComponent} from '@jf/components/confirmation/confirmation.component';
import {LibraryImageDirective} from '@jf/directives/library-image.directive';
import {StripePipe} from '@jf/pipes/stripe.pipe';
import {ChipsComponent} from './components/chips/chips.component';
import {CustomerLookupComponent} from './components/customer-lookup/customer-lookup.component';
import {ExportComponent} from './components/export/export.component';
import {LangListComponent} from './components/lang-list/lang-list.component';
import {LangSinglePageComponent} from './components/lang-single-page/lang-single-page.component';
import {ListComponent} from './components/list/list.component';
import {SearchInputComponent} from './components/search-input/search-input.component';
import {SinglePageComponent} from './components/single-page/single-page.component';
import {WysiwygComponent} from './components/wysiwyg/wysiwyg.component';
import {FileUploadModule} from './modules/file-upload/file-upload.module';
import {ImportComponent} from './components/import/import.component';
import {ForceDisableDirective} from './directives/force-disable/force-disable.directive';
import {JsonEditorComponent} from './components/json-editor/json-editor.component';
import {ProductSelectDialogComponent} from './components/product-select-dialog/product-select-dialog.component';
import {AfAutocompleteComponent} from './components/af-autocomplete/af-autocomplete.component';
import {ProductAutocompleteComponent} from './components/product-autocomplete/product-autocomplete.component';
import {SortDialogComponent} from './components/sort-dialog/sort-dialog.component';

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
  MatAutocompleteModule,
  MatRadioModule,

  // AngularFire
  AngularFirestoreModule,
  AngularFireAuthModule,

  // https://github.com/Jaspero/ng-helpers
  FormTouchOnHoverModule,
  LoadClickModule,
  StopPropagationModule,
  ClickOutsideModule,
  EnumModule,
  EnumKeyFormatModule,
  SanitizeModule,

  FileUploadModule
];

const COMPONENTS = [
  WysiwygComponent,
  ChipsComponent,
  SearchInputComponent,
  ImportComponent,
  CustomerLookupComponent,
  JsonEditorComponent,
  AfAutocompleteComponent,
  ProductAutocompleteComponent
];

const ENTRY_COMPONENTS = [
  ConfirmationComponent,
  ExportComponent,
  ColorPickerComponent,
  ListComponent,
  LangListComponent,
  SinglePageComponent,
  LangSinglePageComponent,
  ProductSelectDialogComponent,
  SortDialogComponent
];

const DIRECTIVES = [ForceDisableDirective, LibraryImageDirective];

const PIPES = [StripePipe];

@NgModule({
  declarations: [...ENTRY_COMPONENTS, ...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [...IMPORTS],
  exports: [...IMPORTS, ...COMPONENTS, ...PIPES, ...DIRECTIVES],
  entryComponents: ENTRY_COMPONENTS,
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class SharedModule {}
