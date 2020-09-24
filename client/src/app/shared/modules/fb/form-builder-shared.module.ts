import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {DbService as FDbService, FormBuilderModule, ROLE, STORAGE_URL, StorageService} from '@jaspero/form-builder';
import {environment} from '../../../../environments/environment';
import {DbService} from '../../services/db/db.service';
import {StateService} from '../../services/state/state.service';

export function roleFactory(state: StateService) {
  return state.role;
}

@NgModule({
  imports: [
    CommonModule,
    FormBuilderModule
  ],
  exports: [
    FormBuilderModule
  ],
  providers: [
    {
      provide: StorageService,
      useExisting: AngularFireStorage
    },
    {
      provide: FDbService,
      useExisting: DbService
    },
    {
      provide: ROLE,
      useFactory: roleFactory,
      deps: [StateService]
    },
    {
      provide: STORAGE_URL,
      useValue: 'https://firebasestorage.googleapis.com/v0/b/' + environment.firebase.storageBucket
    }
  ]
})
export class FormBuilderSharedModule {}
