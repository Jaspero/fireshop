import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';

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
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})
export class SharedModule {}
