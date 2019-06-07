import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckOutGuard} from './shared/guards/check-out.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/landing/landing.module').then(mod => mod.LandingModule)
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./pages/shop/shop.module').then(mod => mod.ShopModule)
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./pages/product/product.module').then(mod => mod.ProductModule)
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./pages/checkout/checkout.module').then(
        mod => mod.CheckoutModule
      ),
    canActivate: [CheckOutGuard],
    data: {
      hideLayout: true
    }
  },
  {
    path: 'my-profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then(mod => mod.ProfileModule)
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/page-not-found/page-not-found.module').then(
        mod => mod.PageNotFoundModule
      )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      // Set to true for debugging
      enableTracing: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
