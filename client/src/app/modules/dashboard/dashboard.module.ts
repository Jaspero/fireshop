import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {TranslocoModule} from '@ngneat/transloco';
import {CanReadModuleGuard} from '../../shared/guards/can-read-module/can-read-module.guard';
import {ActiveLinkDirective} from './components/active-link/active-link.directive';
import {LayoutComponent} from './components/layout/layout.component';
import {DashboardComponent} from './dashboard.component';
import {ModuleInstanceComponent} from './modules/module-instance/module-instance.component';
import {InstanceOverviewComponent} from './modules/module-instance/pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './modules/module-instance/pages/instance-single/instance-single.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: 'settings',
      loadChildren: () =>
        import('./modules/settings/settings.module')
          .then(m => m.SettingsModule)
    },
    {
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: 'module-definition',
      loadChildren: () =>
        import('./modules/module-definition/module-definition.module')
          .then(m => m.ModuleDefinitionModule)
    },
    {
      path: 'm/:id',
      component: ModuleInstanceComponent,
      canActivate: [
        CanReadModuleGuard
      ],
      children: [
        {
          path: 'overview',
          component: InstanceOverviewComponent
        },
        {
          path: 'single/:id',
          component: InstanceSingleComponent
        }
      ]
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    }
  ]
}];

const COMPONENTS = [
  LayoutComponent
];

const DIRECTIVES = [
  ActiveLinkDirective
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    /**
     * Material
     */
    MatIconModule,
    MatTooltipModule,

    /**
     * External
     */
    TranslocoModule
  ]
})
export class DashboardModule { }
