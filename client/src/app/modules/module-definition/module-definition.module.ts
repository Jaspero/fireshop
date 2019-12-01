import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ModuleDefinitionComponent} from './module-definition.component';
import {DefinitionInstanceComponent} from './pages/definition-instance/definition-instance.component';
import {DefinitionOverviewComponent} from './pages/definition-overview/definition-overview.component';

const routes: Routes = [{
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
}];

@NgModule({
  declarations: [
    ModuleDefinitionComponent,
    DefinitionOverviewComponent,
    DefinitionInstanceComponent
  ],
  imports: [
    SharedModule,

    MatTableModule,

    RouterModule.forChild(routes)
  ]
})
export class ModuleDefinitionModule { }
