import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {AngularFirePerformanceModule} from '@angular/fire/performance';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {appInit} from './shared/helpers/app-init';
import {FileUploadModule} from './shared/modules/file-upload/file-upload.module';
import {SharedModule} from './shared/shared.module';
import {SinglePageComponent} from './shared/components/single-page/single-page.component';
import {LangSinglePageComponent} from './shared/components/lang-single-page/lang-single-page.component';
import {DiscountsSinglePageComponent} from './pages/discounts/pages/single-page/discounts-single-page.component';

export function init(injector: Injector) {
  return () => {
    return appInit(injector.get(AngularFirestore));
  };
}

const DECLARATIONS = [
  SinglePageComponent,
  LangSinglePageComponent,
  DiscountsSinglePageComponent
];

@NgModule({
  declarations: [AppComponent, LayoutComponent, ...DECLARATIONS],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,

    FileUploadModule.forRoot(),

    /**
     * External
     */
    AngularFireModule.initializeApp(ENV_CONFIG.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFirePerformanceModule
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
