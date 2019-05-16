import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {CanDeactivateGuard} from '@jf/guards/can-deactivate.guard';
import {SharedModule} from '../../shared/shared.module';
import {ProductsOverviewComponent} from '../products/pages/overview/products-overview.component';
import {OrdersComponent} from './orders.component';
import {OrdersListComponent} from './pages/list/orders-list.component';
import {OrderOverviewComponent} from './pages/overview/order-overview.component';
import {OrdersSinglePageComponent} from './pages/single-page/orders-single-page.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      {path: '', component: OrdersListComponent},
      {path: ':id', component: OrdersSinglePageComponent},
      {
        path: 'overview/:id',
        component: OrderOverviewComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersListComponent,
    OrdersSinglePageComponent,
    OrderOverviewComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class OrdersModule {}
