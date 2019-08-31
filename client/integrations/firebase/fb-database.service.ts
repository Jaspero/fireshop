import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, CollectionReference} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
// @ts-ignore
import * as nanoid from 'nanoid';
import {from} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Module} from '../../src/app/shared/interfaces/module.interface';
import {Settings} from '../../src/app/shared/interfaces/settings.interface';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {FirestoreCollection} from './firestore-collection.enum';

@Injectable()
export class FbDatabaseService extends DbService {
  constructor(
    private afs: AngularFirestore,
    private aff: AngularFireFunctions
  ) {
    super();
  }

  getModules() {
    return this.afs
      .collection(FirestoreCollection.Modules, ref =>
        ref.orderBy('layout.order', 'asc')
      )
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

  getDocuments(moduleId, pageSize, sort?, cursor?, changes?) {
    if (!changes) {
      changes = ['added'];
    }

    return this.collection(moduleId, pageSize, sort, cursor)
      .snapshotChanges(changes)
      .pipe(take(1));
  }

  getStateChanges(moduleId, pageSize, cursor) {
    return this.collection(moduleId, pageSize, null, cursor).stateChanges();
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

  getDocumentsSimple(moduleId, orderBy?, filter?) {
    return this.afs
      .collection(moduleId, (ref: any) => {
        if (orderBy) {
          ref = ref.orderBy(orderBy);
        }

        if (filter) {
          ref = ref.where(filter.key, filter.operator, filter.value);
        }

        return ref;
      })
      .valueChanges({idField: 'id'})
      .pipe(take(1));
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

  createUserAccount(email: string, password: string) {
    const func = this.aff.functions.httpsCallable('createUser');
    return from(func({email, password}));
  }

  removeUserAccount(id: string) {
    const func = this.aff.functions.httpsCallable('removeUser');
    return from(func({id}));
  }

  private collection(moduleId, pageSize, sort, cursor) {
    return this.afs.collection(moduleId, ref => {
      let final = ref;

      if (sort) {
        final = final.orderBy(
          sort.active,
          sort.direction
        ) as CollectionReference;
      }

      if (pageSize) {
        final = final.limit(pageSize) as CollectionReference;
      }

      if (cursor) {
        final = final.startAfter(cursor) as CollectionReference;
      }

      return final;
    });
  }
}
