import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {FirestoreCollection} from '../../enums/firestore-collection.enum';
import {Role} from '../../enums/role.enum';
import {Module} from '../../interfaces/module.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private afs: AngularFirestore, private router: Router) {
    this.modules$ = this.afs
      .collection(FirestoreCollection.Modules)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => ({
            id: action.payload.doc.id,
            ...(action.payload.doc.data() as Module)
          }));
        }),
        shareReplay(1)
      );
  }

  role: Role;
  loadingQue$ = new Subject<Array<string | boolean>>();
  modules$: Observable<Module[]>;

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
