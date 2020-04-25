import {NgModule} from '@angular/core';
import {AngularFireAuthGuard, canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {LoginComponent} from './modules/login/login.component';
import {ModuleDefinitionComponent} from './modules/module-definition/module-definition.component';
import {DefinitionInstanceComponent} from './modules/module-definition/pages/definition-instance/definition-instance.component';
import {DefinitionOverviewComponent} from './modules/module-definition/pages/definition-overview/definition-overview.component';
import {ModuleInstanceComponent} from './modules/module-instance/module-instance.component';
import {InstanceOverviewComponent} from './modules/module-instance/pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './modules/module-instance/pages/instance-single/instance-single.component';
import {ResetPasswordComponent} from './modules/reset-password/reset-password.component';
import {SettingsComponent} from './modules/settings/settings.component';
import {TriggerPasswordResetComponent} from './modules/trigger-password-reset/trigger-password-reset.component';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {CanReadModuleGuard} from './shared/guards/can-read-module/can-read-module.guard';
import {HasClaimGuard} from './shared/guards/has-claim/has-claim.guard';
import {HasCodeGuard} from './shared/guards/has-code/has-code.guard';

const redirectUnauthorized = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [
      AngularFireAuthGuard,
      HasClaimGuard
    ],
    data: {
      authGuardPipe: redirectUnauthorized
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'module-definition',
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
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInTo(['/dashboard']))
  },
  {
    path: 'trigger-password-reset',
    component: TriggerPasswordResetComponent,
    ...canActivate(redirectLoggedInTo(['/dashboard']))
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [HasCodeGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
