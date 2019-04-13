import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {CheckoutComponent} from './checkout.component';

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: CheckoutComponent
      }
    ])
  ]
})
export class CheckoutModule {}
