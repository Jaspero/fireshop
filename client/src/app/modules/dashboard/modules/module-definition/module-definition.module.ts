import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {JsonEditorModule} from '../../../../shared/modules/json-editor/json-editor.module';
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

    /**
     * Local
     */
    JsonEditorModule,

    /**
     * Material
     */
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,

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
