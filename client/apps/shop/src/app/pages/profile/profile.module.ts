import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IsLoggedInGuard} from '../../shared/guards/is-logged-in.guard';
import {MetaResolver} from '../../shared/resolvers/meta.resolver';
import {SharedModule} from '../../shared/shared.module';
import {DeleteUserComponent} from './components/delete-user/delete-user.component';
import {OrdersComponent} from './pages/orders/orders.component';
import {ReviewsComponent} from './pages/reviews/reviews.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {WishListComponent} from './pages/wish-list/wish-list.component';
import {ProfileComponent} from './profile.component';
import {AngularFireStorageModule} from '@angular/fire/storage';

const ENTRY_COMPONENTS = [DeleteUserComponent];

@NgModule({
  declarations: [
    ProfileComponent,
    SettingsComponent,
    WishListComponent,
    OrdersComponent,
    ReviewsComponent,
    ...ENTRY_COMPONENTS
  ],
  entryComponents: ENTRY_COMPONENTS,
  imports: [
    AngularFireStorageModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
        canActivate: [IsLoggedInGuard],
        data: {
          private: true
        },
        children: [
          {
            path: 'settings',
            component: SettingsComponent,
            data: {
              meta: {
                title: 'Settings',
                description: 'Your settings, you can edit bio here'
              }
            },
            resolve: {
              meta: MetaResolver
            }
          },
          {
            path: 'wish-list',
            component: WishListComponent,
            data: {
              meta: {
                title: 'Wish-list',
                description: 'ListComponent of your wish-list products'
              }
            },
            resolve: {
              meta: MetaResolver
            }
          },
          {
            path: 'orders',
            component: OrdersComponent,
            data: {
              meta: {
                title: 'Orders',
                description: 'ListComponent of your orders'
              }
            },
            resolve: {
              meta: MetaResolver
            }
          },
          {
            path: 'reviews',
            component: ReviewsComponent,
            data: {
              meta: {
                title: 'Reviews',
                description: 'ListComponent of your reviews'
              }
            },
            resolve: {
              meta: MetaResolver
            }
          },
          {
            path: '**',
            redirectTo: 'settings'
          }
        ]
      }
    ])
  ]
})
export class ProfileModule {}
