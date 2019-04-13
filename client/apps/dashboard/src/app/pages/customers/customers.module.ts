import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {CustomersComponent} from './customers.component';
import {CustomersListComponent} from './pages/list/customers-list.component';
import {CustomersSinglePageComponent} from './pages/single-page/customers-single-page.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {path: '', component: CustomersListComponent},
      {path: ':id', component: CustomersSinglePageComponent}
    ]
  }
];

@NgModule({
  declarations: [
    CustomersComponent,
    CustomersSinglePageComponent,
    CustomersListComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class CustomersModule {}
