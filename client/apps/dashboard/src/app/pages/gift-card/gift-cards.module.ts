import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanDeactivateGuard} from '@jf/guards/can-deactivate.guard';
import {SharedModule} from '../../shared/shared.module';
import {GiftCardComponent} from './gift-card.component';
import {GiftCardListComponent} from './pages/list/gift-card-list.component';
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
      }
    ]
  }
];

@NgModule({
  declarations: [
    GiftCardComponent,
    GiftCardListComponent,
    GiftCardSinglePageComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class GiftCardsModule {}
