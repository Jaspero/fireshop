import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from './overview.component';

const routes: Routes = [{
  path: '',
  component: OverviewComponent
}];

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    /**
     * Material
     */
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    OverlayModule
  ]
})
export class OverviewModule { }
