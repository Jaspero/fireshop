import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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

    SnippetDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ModuleDefinitionModule { }
