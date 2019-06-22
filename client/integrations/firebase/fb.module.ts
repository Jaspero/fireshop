import {ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAuthGuardModule} from '@angular/fire/auth-guard';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {DB_SERVICE} from '../../src/app/app.module';
import {ENV_CONFIG} from '../../src/env-config';
import {FbDatabaseService} from './fb-database.service';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(ENV_CONFIG.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAuthGuardModule
  ]
})
export class FirebaseModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FirebaseModule,
      providers: [{provide: DB_SERVICE, useClass: FbDatabaseService}]
    };
  }
}
