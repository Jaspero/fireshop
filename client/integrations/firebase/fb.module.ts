import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAuthGuardModule} from '@angular/fire/auth-guard';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireFunctionsModule, ORIGIN, REGION} from '@angular/fire/functions';
import {AngularFirePerformanceModule} from '@angular/fire/performance';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {environment} from '../../src/environments/environment';
import {FbDatabaseService} from './fb-database.service';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAuthGuardModule,
    AngularFirePerformanceModule,
    AngularFireFunctionsModule
  ],
  providers: [
    {
      provide: REGION,
      useValue: 'us-central1'
    },
    {
      provide: ORIGIN,
      useValue: environment.origin
    }
  ]
})
export class FirebaseModule {
  constructor(@Optional() @SkipSelf() parentModule: FirebaseModule) {
    if (parentModule) {
      throw new Error(
        'FirebaseModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(): ModuleWithProviders<FirebaseModule> {
    return {
      ngModule: FirebaseModule,
      providers: [{provide: DbService, useClass: FbDatabaseService}]
    };
  }
}
