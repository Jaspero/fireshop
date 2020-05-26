import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {StripeElementsComponent} from './stripe-elements.component';

const COMPONENTS = [StripeElementsComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CommonModule]
})
export class StripeElementsModule {
  static config(publicKey: string): ModuleWithProviders {
    return {
      ngModule: StripeElementsModule,
      providers: [
        {
          provide: 'publicKey',
          useValue: publicKey
        }
      ]
    };
  }
}
