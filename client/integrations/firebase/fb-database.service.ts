import {Inject, Injectable, Optional} from '@angular/core';
import {AngularFirestore, CollectionReference} from '@angular/fire/firestore';
import {AngularFireFunctions, ORIGIN, REGION} from '@angular/fire/functions';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ExampleType} from '../../src/app/shared/enums/example-type.enum';
import {FilterMethod} from '../../src/app/shared/enums/filter-method.enum';
import {Example} from '../../src/app/shared/interfaces/example.interface';
import {Module} from '../../src/app/shared/interfaces/module.interface';
import {Settings} from '../../src/app/shared/interfaces/settings.interface';
import {WhereFilter} from '../../src/app/shared/interfaces/where-filter.interface';
import {DbService} from '../../src/app/shared/services/db/db.service';
import {environment} from '../../src/environments/environment';
import {FirestoreCollection} from './firestore-collection.enum';

type FilterFunction = (ref: CollectionReference) => CollectionReference;

@Injectable()
export class FbDatabaseService extends DbService {
  constructor(
    public afs: AngularFirestore,
    public aff: AngularFireFunctions,
    @Inject(REGION)
    private region: string,
    @Optional()
    @Inject(ORIGIN)
    private origin: string
  ) {
    super();
  }

  url(url: string) {

    if (environment.origin) {
      return [
        environment.origin,
        environment.firebase.projectId,
        this.region,
        url
      ]
        .join('/');
    } else {
      return `https://${this.region}-${environment.firebase.projectId}.cloudfunctions.net/${url}`;
    }
  }

  getModules() {
    return this.afs
      .collection(FirestoreCollection.Modules)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions
            .map(action => ({
              id: action.payload.doc.id,
              ...(action.payload.doc.data() as Module)
            }))
            .sort((a, b) => b.layout?.order - a.layout?.order)
        )
      );
  }

  setModule(data: Partial<Module>, id?: string) {
    return from(
      this.afs
        .collection(FirestoreCollection.Modules)
        .doc(id || this.afs.createId())
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
    return this.callFunction('cms-getExamples', type);
  }

  getUserSettings() {
    return this.afs
      .collection(FirestoreCollection.Settings)
      .doc<Settings>('user')
      .get()
      .pipe(
        map(it => ({
          id: it.id,
          ...it.data() as Settings
        }))
      )
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
        source: source || 'default'
      })
      .pipe(
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

    if (stream) {

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
    } else {
      pipes.push(
        map((value: any) => ({
          id: documentId,
          ...value.data()
        }))
      );

      return this.afs
        .collection(moduleId)
        .doc<T>(documentId)
        .get()
        .pipe(
          // @ts-ignore
          ...pipes
        );
    }
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
      .get()
      .pipe(
        map(data =>
          data.docs.map((it: any) => ({
            id: it.id,
            ...it.data()
          }))
        )
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

  createUserAccount(email: string, password: string) {
    return this.callFunction('cms-createUser', {email, password}) as any;
  }

  removeUserAccount(id: string) {
    return this.callFunction('cms-removeUser', {id});
  }

  callFunction(name: string, data) {
    return this.aff.httpsCallable(name)(data)
  }

  createId() {
    return this.afs.createId();
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
