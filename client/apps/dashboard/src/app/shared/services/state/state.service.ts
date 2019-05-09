import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {Language} from '@jf/enums/language.enum';
import {BehaviorSubject, Subject} from 'rxjs';
import {Role} from '../../enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private router: Router) {}

  language$ = new BehaviorSubject<Language>(STATIC_CONFIG.lang);
  loadingQue$ = new Subject<Array<string | boolean>>();

  /**
   * Logged in users role
   */
  role: Role;

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
        active: 'createdOn'
      },
      pageSize: 10
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
