import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {CheckoutComponent} from './checkout.component';
import {CheckoutErrorComponent} from './checkout-error/checkout-error.component';
import {CheckoutSuccessComponent} from './checkout-success/checkout-success.component';

const routes: Routes = [
  {path: '', component: CheckoutComponent},
  {path: 'error', component: CheckoutErrorComponent},
  {path: 'success', component: CheckoutSuccessComponent}
];

@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutErrorComponent,
    CheckoutSuccessComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class CheckoutModule {}
