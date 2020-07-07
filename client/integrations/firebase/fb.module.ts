import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAuthGuardModule} from '@angular/fire/auth-guard';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFirePerformanceModule} from '@angular/fire/performance';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {ENV_CONFIG} from '../../src/env-config';
import {FbDatabaseService} from './fb-database.service';
import 'firebase/functions';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(ENV_CONFIG.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAuthGuardModule,
    AngularFirePerformanceModule
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
