import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {Module} from '../../interfaces/module.interface';
import {DbService} from '../db/db.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private dbService: DbService, private router: Router) {
    this.modules$ = this.dbService.getModules().pipe(shareReplay(1));
  }

  role: string;
  user: User;
  loadingQue$ = new Subject<Array<string | boolean>>();
  modules$: Observable<Module[]>;

  /**
   * Array of components that need to
   * run save() methods on single instance
   */
  saveComponents: any[] = [];

  /**
   * Holds state information for all
   * previously loaded routes
   */
  routerData: {[url: string]: any} = {};

  setRouteData(
    data: any,
    url = this.router.routerState.snapshot.url
  ) {
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
