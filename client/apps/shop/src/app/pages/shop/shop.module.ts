import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MetaResolver} from '../../shared/resolvers/meta.resolver';
import {SharedModule} from '../../shared/shared.module';
import {ShopComponent} from './shop.component';
import {MatInputModule, MatProgressBarModule} from '@angular/material';

@NgModule({
  declarations: [ShopComponent],
  imports: [
    MatInputModule,
    MatProgressBarModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShopComponent,
        data: {
          meta: {
            title: 'Shop',
            description: 'ListComponent of the products in our shop'
          }
        },
        resolve: {
          meta: MetaResolver
        }
      }
    ])
  ]
})
export class ShopModule {}
