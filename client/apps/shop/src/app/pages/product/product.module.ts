import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ProductComponent} from './product.component';
import {ProductResolver} from './resolvers/product.resolver';

@NgModule({
  declarations: [ProductComponent],
  providers: [ProductResolver],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: ProductComponent,
        resolve: {
          product: ProductResolver
        }
      }
    ])
  ]
})
export class ProductModule {}
