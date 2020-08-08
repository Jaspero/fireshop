import {OverlayModule} from '@angular/cdk/overlay';
import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FirebaseModule} from '../../integrations/firebase/fb.module';
import {FUNCTIONS_REGION} from '../../integrations/firebase/functions-region.token';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ConfirmationComponent} from './shared/components/confirmation/confirmation.component';
import {MathPipe} from './shared/pipes/math/math-pipe.';
import {appInit} from './shared/utils/app-init';
import {TranslocoRootModule} from './transloco-root.module';

export function init(injector: Injector) {
  return () => {
    return appInit(injector);
  };
}

const ENTRY_COMPONENTS = [
  ConfirmationComponent
];

const PIPES = [
  MathPipe
];

@NgModule({
  declarations: [
    AppComponent,
    ...ENTRY_COMPONENTS,
    ...PIPES,
  ],
  imports: [
    /**
     * Replace with another implementation
     * if necessary
     */
    FirebaseModule.forRoot(),

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayModule,
    MatTooltipModule,

    // Material
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,

    /**
     * External
     */
    TranslocoRootModule
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-US'
    },
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [Injector],
      multi: true
    },
    {
      provide: FUNCTIONS_REGION,
      useValue: 'us-central1'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
