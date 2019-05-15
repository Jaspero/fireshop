import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MetaResolver} from '../../shared/resolvers/meta.resolver';
import {StructuredDataResolver} from '../../shared/resolvers/structured-data.resolver';
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
          },
          structuredData: {
            '@type': 'Landing page',
            name: 'Fireshop',
            email: 'info@jaspero.co',
            logo: 'http://jaspero.co/assets/imgs/logo.svg',
            author: {
              '@type': 'Company',
              name: 'Jaspero Ltd.'
            },
            description: 'A modern pwa webshop built on Firebase with Angular',
            keywords: 'web-shop, jaspero, firebase, angular'
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
export class LandingModule {}
