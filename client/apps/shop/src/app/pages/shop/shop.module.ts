import {NgModule} from '@angular/core';
import {MatInputModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {MetaResolver} from '../../shared/resolvers/meta.resolver';
import {StructuredDataResolver} from '../../shared/resolvers/structured-data.resolver';
import {SharedModule} from '../../shared/shared.module';
import {ShopComponent} from './shop.component';

@NgModule({
  declarations: [ShopComponent],
  imports: [
    MatInputModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShopComponent,
        data: {
          meta: {
            title: 'Shop',
            description: 'ListComponent of the products in our shop'
          },
          structuredData: {
            '@type': 'WebSite',
            name: 'Shop',
            description: 'List component of the products in our shop'
          }
        },
        resolve: {
          meta: MetaResolver,
          structuredData: StructuredDataResolver
        }
      }
    ])
  ]
})
export class ShopModule {}
