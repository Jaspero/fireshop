import {APP_INITIALIZER, Injector, NgModule, PLATFORM_ID} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {AngularFirePerformanceModule} from '@angular/fire/performance';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {
  JpImagePreloadModule,
  JpPreloadService
} from '@jaspero/ng-image-preload';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UpdateAvailableComponent} from './shared/components/update-available/update-available.component';
import {appInit} from './shared/helpers/app-init';
import {NetworkService} from './shared/services/network/network.service';
import {StateService} from './shared/services/state/state.service';
import {SharedModule} from './shared/shared.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';

export function init(injector: Injector) {
  return () => {
    return appInit(
      injector.get(PLATFORM_ID),
      injector.get(NetworkService),
      injector.get(JpPreloadService),
      injector.get(AngularFirestore),
      injector.get(StateService)
    );
  };
}

const ENTRY_COMPONENTS = [UpdateAvailableComponent];

@NgModule({
  declarations: [AppComponent, ...ENTRY_COMPONENTS],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.serviceWorker
    }),

    /**
     * External
     */
    AngularFireModule.initializeApp(ENV_CONFIG.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFirePerformanceModule,
    MatProgressBarModule,
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
  bootstrap: [AppComponent]
})
export class AppModule {}
