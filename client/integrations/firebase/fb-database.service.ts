import {Injectable} from '@angular/core';
import {AngularFirestore, CollectionReference} from '@angular/fire/firestore';
// @ts-ignore
import * as nanoid from 'nanoid';
import {from} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {DbService} from '../../src/app/shared/interfaces/db-service.interface';
import {Module} from '../../src/app/shared/interfaces/module.interface';
import {Settings} from '../../src/app/shared/interfaces/settings.interface';
import {FirestoreCollection} from './firestore-collection.enum';

@Injectable()
export class FbDatabaseService implements DbService {
  constructor(private afs: AngularFirestore) {}

  getModules() {
    return this.afs
      .collection(FirestoreCollection.Modules)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => ({
            id: action.payload.doc.id,
            ...(action.payload.doc.data() as Module)
          }))
        )
      );
  }

  setModule(data: Partial<Module>, id?: string) {
    return from(
      this.afs
        .collection(FirestoreCollection.Modules)
        .doc(id || nanoid())
        .set(data)
    );
  }

  removeModule(id: string) {
    return from(
      this.afs
        .collection(FirestoreCollection.Modules)
        .doc(id)
        .delete()
    );
  }

  getUserSettings() {
    return this.afs
      .collection(FirestoreCollection.Settings)
      .doc<Settings>('user')
      .valueChanges()
      .pipe(take(1));
  }

  updateUserSettings(settings: Partial<Settings>) {
    return from(
      this.afs
        .collection(FirestoreCollection.Settings)
        .doc('user')
        .update(settings)
    );
  }

  getDocuments(moduleId, pageSize, cursor) {
    return this.afs.collection(moduleId, ref => {
      let final = ref;

      if (pageSize) {
        final = final.limit(pageSize) as CollectionReference;
      }

      if (cursor) {
        final = final.startAfter(cursor) as CollectionReference;
      }

      return final;
    });
  }

  getDocument(moduleId, documentId) {
    return this.afs
      .collection(moduleId)
      .doc(documentId)
      .valueChanges()
      .pipe(
        take(1),
        map(value => ({
          ...value,
          id: documentId
        }))
      );
  }

  setDocument(moduleId, documentId, data, options) {
    return from(
      this.afs
        .collection(moduleId)
        .doc(documentId)
        .set(data, options || {})
    );
  }

  removeDocument(moduleId, documentId) {
    return from(
      this.afs
        .collection(moduleId)
        .doc(documentId)
        .delete()
    );
  }
}
