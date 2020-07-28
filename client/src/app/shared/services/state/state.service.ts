import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {FirestoreCollection} from '../../../../../integrations/firebase/firestore-collection.enum';
import {Layout} from '../../interfaces/layout.interface';
import {Module} from '../../interfaces/module.interface';
import {User} from '../../interfaces/user.interface';
import {DbService} from '../db/db.service';
import {TranslocoService} from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  role: string;
  user: User;
  loadingQue$ = new Subject<Array<string | boolean>>();
  modules$: Observable<Module[]>;
  layout$: Observable<Layout>;
  language: string;
  /**
   * Holds state information for all
   * previously loaded routes
   */
  routerData: {[url: string]: any} = {};

  constructor(
    private dbService: DbService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transloco: TranslocoService
  ) {
    this.language = localStorage.getItem('language') || 'en';
    this.transloco.setActiveLang(this.language);

    this.modules$ = this.dbService.getModules().pipe(shareReplay(1));
    this.layout$ = this.dbService.getDocument(
      FirestoreCollection.Settings,
      'layout',
      true
    )
      .pipe(
        map(value => {
          delete value.id;
          return value;
        }),
        shareReplay(1)
      );
  }

  setRouteData(
    data: any,
    url = this.router.routerState.snapshot.url
  ) {
    this.routerData[url] = data;

    const persisted = data.filter ? data.filter.filter(it => it.persist) : null;

    this.router.navigate([], {
      queryParams: persisted && persisted.length ? {
        filter: JSON.stringify(persisted)
      } : {}
    });
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
    const {url} = this.router.routerState.snapshot;

    if (this.routerData[url]) {
      return this.routerData[url];
    } else {
      return defaultData;
    }
  }

  restoreRouteData(defaultData = {}) {
    const {url} = this.router.routerState.snapshot;
    const {queryParams} = this.activatedRoute.snapshot;

    if (queryParams.filter) {

      let filter;

      try {
        filter = JSON.parse(queryParams.filter);
      } catch (e) {
      }

      if (filter) {
        this.routerData[url] = {
          ...defaultData,
          filter
        };
      }
    }
  }
}
