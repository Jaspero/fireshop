import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ReviewsComponent} from './reviews.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewsComponent
  }
];

@NgModule({
  declarations: [ReviewsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: []
})
export class ReviewsModule {}
