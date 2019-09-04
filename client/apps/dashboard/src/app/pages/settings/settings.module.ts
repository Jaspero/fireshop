import {NgModule} from '@angular/core';
import {AngularFireFunctionsModule} from '@angular/fire/functions';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {SettingsComponent} from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent
  }
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    SharedModule,

    AngularFireFunctionsModule,

    RouterModule.forChild(routes)
  ]
})
export class SettingsModule {}
