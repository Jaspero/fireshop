import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {FormBuilderSharedModule} from '../../../../shared/modules/fb/form-builder-shared.module';
import {JsonEditorModule} from '../../../../shared/modules/json-editor/json-editor.module';
import {SearchInputModule} from '../../../../shared/modules/search-input/search-input.module';
import {LayoutSettingsComponent} from './components/layout-settings/layout-settings.component';
import {SnippetDialogComponent} from './components/snippet-dialog/snippet-dialog.component';
import {ModuleDefinitionComponent} from './module-definition.component';
import {DefinitionInstanceComponent} from './pages/definition-instance/definition-instance.component';
import {DefinitionOverviewComponent} from './pages/definition-overview/definition-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ModuleDefinitionComponent,
    children: [
      {
        path: 'overview',
        component: DefinitionOverviewComponent
      },
      {
        path: 'single/:id',
        component: DefinitionInstanceComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    ModuleDefinitionComponent,
    DefinitionOverviewComponent,
    DefinitionInstanceComponent,

    SnippetDialogComponent,
    LayoutSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,

    /**
     * Local
     */
    JsonEditorModule,
    SearchInputModule,
    FormBuilderSharedModule,

    /**
     * Material
     */
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,

    /**
     * Ng Helpers
     */
    LoadClickModule,

    /**
     * External
     */
    TranslocoModule
  ]
})
export class ModuleDefinitionModule { }
