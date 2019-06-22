import {Observable} from 'rxjs';
import {Module} from './module.interface';
import {Settings} from './settings.interface';

export interface DbService {
  getModules(): Observable<Module[]>;

  /**
   * Create or update a module
   */
  setModule(data: Partial<Module>, id?: string): Observable<void>;

  removeModule(id: string): Observable<void>;

  getUserSettings(): Observable<Settings>;

  updateUserSettings(settings: Partial<Settings>): Observable<void>;

  getDocuments(
    moduleId: string,
    pageSize?: number,
    cursor?: any
  ): Observable<any[]>;

  getDocument(moduleId: string, documentId: string): Observable<any>;

  setDocument(
    moduleId: string,
    documentId: string,
    data: any,
    options?: any
  ): Observable<void>;

  removeDocument(moduleId: string, documentId: string): Observable<void>;
}
