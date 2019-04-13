import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MetaResolver} from '../../shared/resolvers/meta.resolver';
import {SharedModule} from '../../shared/shared.module';
import {LandingComponent} from './landing.component';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingComponent,
        data: {
          meta: {
            title: 'Home page',
            description: 'Home page of the fireshop webshop'
          }
        },
        resolve: {
          meta: MetaResolver
        }
      }
    ])
  ]
})
export class LandingModule {}
