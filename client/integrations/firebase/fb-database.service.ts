import {Injectable} from '@angular/core';
import {AngularFirestore, CollectionReference} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
// @ts-ignore
import * as nanoid from 'nanoid';
import {from, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {ExampleType} from '../../src/app/shared/enums/example-type.enum';
import {FilterMethod} from '../../src/app/shared/enums/filter-method.enum';
import {Example} from '../../src/app/shared/interfaces/example.interface';
import {Module} from '../../src/app/shared/interfaces/module.interface';
import {Settings} from '../../src/app/shared/interfaces/settings.interface';
import {WhereFilter} from '../../src/app/shared/interfaces/where-filter.interface';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {FirestoreCollection} from './firestore-collection.enum';

type FilterFunction = (ref: CollectionReference) => CollectionReference;

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

  getExamples(type: ExampleType): Observable<{data: Example[]}> {
    const func = this.aff.functions.httpsCallable('cms-getExamples');
    return from(func(type)) as any;
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

  getDocuments(
    moduleId,
    pageSize,
    sort?,
    cursor?,
    filters?,
    source?
  ) {
    return this.collection(moduleId, pageSize, sort, cursor, this.filterMethod(filters))
      .get({
        source: source || 'server'
      })
      .pipe(
        take(1),
        map(res =>
          res.docs
        )
      );
  }

  getStateChanges(
    moduleId,
    pageSize?,
    sort?,
    cursor?,
    filters?: WhereFilter[],
  ) {
    return this.collection(
      moduleId,
      pageSize,
      sort,
      cursor,
      this.filterMethod(filters)
    )
      .stateChanges();
  }

  getDocument<T = any>(
    moduleId,
    documentId,
    stream = false
  ): Observable<T> {

    const pipes = [];

    if (!stream) {
      pipes.push(take(1));
    }

    pipes.push(
      map((value: any) => ({
        ...value,
        id: documentId
      }))
    );

    return this.afs
      .collection(moduleId)
      .doc<T>(documentId)
      .valueChanges()
      .pipe(
        // @ts-ignore
        ...pipes
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
    const func = this.aff.functions.httpsCallable('cms-createUser');
    return from(func({email, password})) as any;
  }

  removeUserAccount(id: string) {
    const func = this.aff.functions.httpsCallable('cms-removeUser');
    return from(func({id}));
  }

  private collection(
    moduleId,
    pageSize,
    sort,
    cursor,
    filter?: (ref: CollectionReference) => CollectionReference
  ) {
    return this.afs.collection(moduleId, ref => {
      let final = ref;

      if (sort) {
        final = final.orderBy(
          sort.active,
          sort.direction
        ) as CollectionReference;
      }

      if (filter) {
        final = filter(final);
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

  private filterMethod(
    filters?: WhereFilter[]
  ) {
    let fMethod: FilterFunction;

    if (filters) {
      fMethod = (ref) => {
        filters.forEach(item => {

          if (
            item.value !== undefined &&
            item.value !== null &&
            item.value !== '' &&
            (
              (
                item.operator === FilterMethod.ArrayContains ||
                item.operator === FilterMethod.ArrayContainsAny ||
                item.operator === FilterMethod.In
              ) && Array.isArray(item.value) ?
                item.value.length :
                true
            )
          ) {
            // @ts-ignore
            ref = ref.where(item.key, item.operator, item.value) as CollectionReference;
          }
        });

        return ref;
      };
    }

    return fMethod;
  }
}
