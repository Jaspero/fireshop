import {NgModule} from '@angular/core';
import {AngularFireFunctionsModule} from '@angular/fire/functions';
import {RouterModule, Routes} from '@angular/router';
import {CheckoutCompleteGuard} from '../../shared/guards/checkout-complete.guard';
import {SharedModule} from '../../shared/shared.module';
import {CheckoutComponent} from './checkout.component';
import {CheckoutErrorComponent} from './checkout-error/checkout-error.component';
import {CheckoutSuccessComponent} from './checkout-success/checkout-success.component';

const routes: Routes = [
  {path: '', component: CheckoutComponent},
  {
    path: 'error',
    component: CheckoutErrorComponent,
    canActivate: [CheckoutCompleteGuard]
  },
  {
    path: 'success',
    component: CheckoutSuccessComponent,
    canActivate: [CheckoutCompleteGuard]
  }
];

@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutErrorComponent,
    CheckoutSuccessComponent
  ],
  imports: [
    SharedModule,

    AngularFireFunctionsModule,

    RouterModule.forChild(routes)
  ],
  providers: [CheckoutCompleteGuard]
})
export class CheckoutModule {}
