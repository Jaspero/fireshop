import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {OrdersComponent} from './orders.component';
import {OrdersListComponent} from './pages/list/orders-list.component';
import {OrdersSinglePageComponent} from './pages/single-page/orders-single-page.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      {path: '', component: OrdersListComponent},
      {path: ':id', component: OrdersSinglePageComponent}
    ]
  }
];

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersListComponent,
    OrdersSinglePageComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class OrdersModule {}
