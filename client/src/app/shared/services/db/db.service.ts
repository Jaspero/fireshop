import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Module} from '../../interfaces/module.interface';
import {Settings} from '../../interfaces/settings.interface';
import {ExampleType} from '../../enums/example-type.enum';
import {Example} from '../../interfaces/example.interface';
import {WhereFilter} from '../../interfaces/where-filter.interface';

@Injectable({providedIn: 'root'})
export abstract class DbService {

  url(url: string) {
    return url;
  }

  getModules(): Observable<Module[]> {
    return of([]);
  }

  /**
   * Create or update a module
   */
  setModule(data: Partial<Module>, id?: string): Observable<void> {
    return of();
  }

  removeModule(id: string): Observable<void> {
    return of();
  }

  getUserSettings(): Observable<Settings> {
    return of(null);
  }

  updateUserSettings(settings: Partial<Settings>): Observable<void> {
    return of();
  }

  getExamples(type: ExampleType): Observable<{data: Example[]}> {
    return of();
  }

  getDocuments(
    moduleId: string,
    pageSize?: number,
    sort?: {
      active: string;
      direction: string;
    },
    cursor?: any,
    filters?: WhereFilter[],
    source?: string
  ): Observable<any[]> {
    return of([]);
  }

  getDocumentsSimple(
    moduleId: string,
    orderBy?: string,
    filter?: WhereFilter
  ): Observable<any[]> {
    return of([]);
  }

  getSubdocumentsSimple(
    moduleId: string,
    orderBy?: string,
    filter?: WhereFilter
  ): Observable<any[]> {
    return of([]);
  }

  getStateChanges(
    moduleId: string,
    pageSize?: number,
    sort?: {
      active: string;
      direction: string;
    },
    cursor?: any,
    filters?: WhereFilter[],
  ): Observable<any[]> {
    return of([]);
  }

  getDocument<T = any>(
    moduleId: string,
    documentId: string,
    stream = false
  ): Observable<T> {
    return of(null);
  }

  setDocument(
    moduleId: string,
    documentId: string,
    data: any,
    options?: any
  ): Observable<void> {
    return of();
  }

  removeDocument(moduleId: string, documentId: string): Observable<void> {
    return of();
  }

  createUserAccount(email: string, password: string): Observable<{id: string}> {
    return of();
  }

  removeUserAccount(id: string): Observable<any> {
    return of();
  }

  callFunction(name: string, data: any): Observable<any> {
    return of();
  }

  createId() {
    return '';
  }
}
