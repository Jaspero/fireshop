import {APP_INITIALIZER, Injector, NgModule, PLATFORM_ID} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {
  BrowserModule,
  BrowserTransferStateModule
} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {
  JpImagePreloadModule,
  JpPreloadService
} from '@jaspero/ng-image-preload';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UpdateAvailableComponent} from './shared/components/update-available/update-available.component';
import {appInit} from './shared/helpers/app-init';
import {NetworkService} from './shared/services/network/network.service';
import {SharedModule} from './shared/shared.module';

export function init(injector: Injector) {
  return () => {
    return appInit(
      injector.get(PLATFORM_ID),
      injector.get(NetworkService),
      injector.get(JpPreloadService)
    );
  };
}

const ENTRY_COMPONENTS = [UpdateAvailableComponent];

@NgModule({
  declarations: [AppComponent, ...ENTRY_COMPONENTS],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'fireshop-universal'
    }),
    BrowserTransferStateModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),

    /**
     * External
     */
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,

    JpImagePreloadModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [Injector],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: ENTRY_COMPONENTS
})
export class AppModule {}
