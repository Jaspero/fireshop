import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FirebaseModule} from '../../integrations/firebase/fb.module';
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
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      }
    },
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
