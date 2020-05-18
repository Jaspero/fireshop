import {NgModule} from '@angular/core';
import {AngularFireFunctionsModule} from '@angular/fire/functions';
import {RouterModule, Routes} from '@angular/router';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {CheckoutCompleteGuard} from '../../shared/guards/checkout-complete.guard';
import {StripeElementsModule} from '../../shared/modules/stripe-elements/stripe-elements.module';
import {SharedModule} from '../../shared/shared.module';
import {CheckoutComponent} from './checkout.component';
import {CheckoutErrorComponent} from './checkout-error/checkout-error.component';
import {CheckoutSuccessComponent} from './checkout-success/checkout-success.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent
  },
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
    StripeElementsModule.config(ENV_CONFIG.stripe.token),
    RouterModule.forChild(routes)
  ],
  providers: [CheckoutCompleteGuard]
})
export class CheckoutModule {}
