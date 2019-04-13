import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {LoginGuard} from './shared/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'products',
        loadChildren: './pages/products/products.module#ProductsModule'
      },
      {
        path: 'categories',
        loadChildren: './pages/categories/categories.module#CategoriesModule'
      },
      {
        path: 'orders',
        loadChildren: './pages/orders/orders.module#OrdersModule'
      },
      {
        path: 'customers',
        loadChildren: './pages/customers/customers.module#CustomersModule'
      },
      {
        path: 'discounts',
        loadChildren: './pages/discounts/discounts.module#DiscountsModule'
      },
      {
        path: 'reviews',
        loadChildren: './pages/reviews/reviews.module#ReviewsModule'
      },
      {
        path: 'settings',
        loadChildren: './pages/settings/settings.module#SettingsModule'
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
    loadChildren: './pages/login/login.module#LoginModule',
    canActivate: [LoginGuard]
  },
  {
    path: 'reset-password',
    loadChildren:
      './pages/reset-password/reset-password.module#ResetPasswordModule',
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
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
      scrollPositionRestoration: 'top',
      enableTracing: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
