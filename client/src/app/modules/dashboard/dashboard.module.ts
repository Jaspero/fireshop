import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {TranslocoModule} from '@ngneat/transloco';
import {DbService} from '../../shared/services/db/db.service';
import {StateService} from '../../shared/services/state/state.service';
import {ActiveLinkDirective} from './components/active-link/active-link.directive';
import {LayoutComponent} from './components/layout/layout.component';

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
      loadChildren: () =>
        import('./modules/overview/overview.module')
          .then(m => m.OverviewModule)
    },
    {
      path: 'profile',
      loadChildren: () =>
        import('./modules/profile/profile.module')
          .then(m => m.ProfileModule)
    },
    {
      path: 'module-definition',
      loadChildren: () =>
        import('./modules/module-definition/module-definition.module')
          .then(m => m.ModuleDefinitionModule)
    },
    {
      path: 'm',
      loadChildren: () =>
        import('./modules/module-instance/module-instance.module')
          .then(m => m.ModuleInstanceModule)
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
  ],
  providers: [
    /**
     * We provide it with a string referenc here
     * so that it can be used in plugins
     */
    {
      provide: 'stateService',
      useExisting: StateService
    },
    {
      provide: 'dbService',
      useExisting: DbService
    },
  ]
})
export class DashboardModule { }
