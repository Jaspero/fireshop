import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ResetPasswordComponent} from './reset-password.component';

const routes: Routes = [{
  path: '',
  component: ResetPasswordComponent
}];

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ResetPasswordModule { }
