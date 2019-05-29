import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanDeactivateGuard} from '@jf/guards/can-deactivate.guard';
import {SharedModule} from '../../shared/shared.module';
import {GiftCardComponent} from './gift-card.component';
import {GiftCardListComponent} from './pages/list/gift-card-list.component';
import {GiftCardOverviewComponent} from './pages/overview/gift-card-overview.component';
import {GiftCardSinglePageComponent} from './pages/single-page/gift-card-single-page.component';

const routes: Routes = [
  {
    path: '',
    component: GiftCardComponent,
    children: [
      {path: '', component: GiftCardListComponent},
      {
        path: ':id',
        component: GiftCardSinglePageComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'overview/:id',
        component: GiftCardOverviewComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [
    GiftCardComponent,
    GiftCardListComponent,
    GiftCardSinglePageComponent,
    GiftCardOverviewComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class GiftCardsModule {}
