import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {DB_SERVICE} from '../../../app.module';
import {Role} from '../../enums/role.enum';
import {DbService} from '../../interfaces/db-service.interface';
import {Module} from '../../interfaces/module.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(
    @Inject(DB_SERVICE)
    private dbService: DbService,
    private router: Router
  ) {
    this.modules$ = this.dbService.getModules().pipe(shareReplay(1));
  }

  role: Role;
  loadingQue$ = new Subject<Array<string | boolean>>();
  modules$: Observable<Module[]>;

  /**
   * Array of components that need to
   * run save() methods on single instance
   */
  uploadComponents: any[] = [];

  /**
   * Holds state information for all
   * previously loaded routes
   */
  routerData: {[url: string]: any} = {};

  setRouteData(data: any) {
    const url = this.router.routerState.snapshot.url;
    this.routerData[url] = data;
  }

  getRouterData<T = any>(
    defaultData: any = {
      sort: {
        direction: 'desc',
        active: 'name'
      },
      pageSize: 10,
      filters: {
        search: ''
      }
    }
  ): T {
    const url = this.router.routerState.snapshot.url;

    if (this.routerData[url]) {
      return this.routerData[url];
    } else {
      return defaultData;
    }
  }
}
