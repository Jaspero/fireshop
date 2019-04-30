import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanDeactivateGuard} from '@jf/guards/can-deactivate.guard';
import {SharedModule} from '../../shared/shared.module';
import {CustomersComponent} from './customers.component';
import {CustomersListComponent} from './pages/list/customers-list.component';
import {CustomersOverviewComponent} from './pages/overview/customers-overview.component.';
import {CustomersSinglePageComponent} from './pages/single-page/customers-single-page.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {path: '', component: CustomersListComponent},
      {
        path: ':id',
        component: CustomersSinglePageComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'single/:id',
        component: CustomersOverviewComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    CustomersComponent,
    CustomersSinglePageComponent,
    CustomersListComponent,
    CustomersOverviewComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class CustomersModule {}
