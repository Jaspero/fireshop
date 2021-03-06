import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {HasCodeGuard} from './guards/has-code/has-code.guard';
import {ResetPasswordComponent} from './reset-password.component';

const routes: Routes = [{
  path: '',
  component: ResetPasswordComponent,
  canActivate: [HasCodeGuard]
}];

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  providers: [
    HasCodeGuard
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    /**
     * Material
     */
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,

    /**
     * Ng Helpers
     */
    LoadClickModule,

    /**
     * External
     */
    TranslocoModule
  ]
})
export class ResetPasswordModule { }
