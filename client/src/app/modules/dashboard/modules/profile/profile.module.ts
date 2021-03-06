import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {FormBuilderSharedModule} from '../../../../shared/modules/fb/form-builder-shared.module';
import {ProfileInformationComponent} from './pages/profile-information/profile-information.component';
import {ProfileSecurityComponent} from './pages/profile-security/profile-security.component';
import {ProfileComponent} from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'information',
        component: ProfileInformationComponent
      },
      {
        path: 'security',
        component: ProfileSecurityComponent
      },
      {
        path: '**',
        redirectTo: 'information',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileSecurityComponent,
    ProfileInformationComponent
  ],
  imports: [

    /**
     * Angular
     */
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    /**
     * Material
     */
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,

    /**
     * External
     */
    FormBuilderSharedModule,
    LoadClickModule,
    TranslocoModule,
  ]
})
export class ProfileModule { }
