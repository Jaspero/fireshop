import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LoadClickModule, SanitizeModule} from '@jaspero/ng-helpers';
import {FilterDialogComponent} from '../modules/module-instance/components/filter-dialog/filter-dialog.component';
import {SortDialogComponent} from '../modules/module-instance/components/sort-dialog/sort-dialog.component';
import {CompiledFormComponent} from './components/compiled-form/compiled-form.component';
import {ExportComponent} from './components/export/export.component';
import {FilterTagsComponent} from './components/filter-tags/filter-tags.component';
import {ImportComponent} from './components/import/import.component';
import {JsonEditorComponent} from './components/json-editor/json-editor.component';
import {LayoutComponent} from './components/layout/layout.component';
import {SearchInputComponent} from './components/search-input/search-input.component';
import {DropzoneDirective} from './directives/dropzone/dropzone.directive';
import {ForceDisableDirective} from './directives/force-disable/force-disable.directive';
import {MathPipe} from './pipes/math/math-pipe.';

const MODULES = [
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,

  // Material
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatSortModule,
  MatSnackBarModule,
  MatMenuModule,
  MatDialogModule,
  MatListModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatSelectModule,
  PortalModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSliderModule,
  DragDropModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatChipsModule,
  MatBottomSheetModule,
  MatProgressBarModule,

  // Ng Helpers
  LoadClickModule,
  SanitizeModule
];

const COMPONENTS = [
  SearchInputComponent,
  JsonEditorComponent,
  LayoutComponent,
  ImportComponent,
  CompiledFormComponent
];

const ENTRY_COMPONENTS = [
  ExportComponent,
  SortDialogComponent,
  FilterDialogComponent,
  FilterTagsComponent
];

const DIRECTIVES = [ForceDisableDirective, DropzoneDirective];

const PIPES = [
  MathPipe
];

@NgModule({
  imports: [
    ...MODULES
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  providers: [],
  entryComponents: ENTRY_COMPONENTS
})
export class SharedModule {}
