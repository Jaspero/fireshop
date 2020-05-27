import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanDeactivateGuard} from '@jf/guards/can-deactivate.guard';
import {SharedModule} from '../../shared/shared.module';
import {SaleListComponent} from './pages/list/sale-list.component';
import {SaleSinglePageComponent} from './pages/single-page/sale-single-page.component';
import {SaleComponent} from './sale.component';

const routes: Routes = [
  {
    path: '',
    component: SaleComponent,
    children: [
      {path: '', component: SaleListComponent},
      {
        path: ':id',
        component: SaleSinglePageComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [SaleComponent, SaleListComponent, SaleSinglePageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class SaleModule {}
