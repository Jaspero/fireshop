import {NgModule} from '@angular/core';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {RouterModule, Routes} from '@angular/router';
import {HasClaimGuard} from './shared/guards/has-claim/has-claim.guard';

const redirectUnauthorized = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['/dashboard']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    canActivate: [
      AngularFireAuthGuard,
      HasClaimGuard
    ],
    data: {
      authGuardPipe: redirectUnauthorized
    }
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module')
        .then(m => m.LoginModule),
    canActivate: [
      AngularFireAuthGuard
    ],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'trigger-password-reset',
    loadChildren: () =>
      import('./modules/trigger-password-reset/trigger-password-reset.module')
        .then(m => m.TriggerPasswordResetModule),
    canActivate: [
      AngularFireAuthGuard
    ],
    data: {
      authGuardPipe: redirectLoggedInToDashboard
    },
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./modules/reset-password/reset-password.module')
        .then(m => m.ResetPasswordModule)
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
