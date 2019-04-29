import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {LoadState} from '@jf/enums/load-state.enum';
import {BehaviorSubject, forkJoin, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {StateService} from '../../../../shared/services/state/state.service';

@Component({
  selector: 'jfs-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishListComponent implements OnInit {
  constructor(private state: StateService, private afs: AngularFirestore) {}

  dataState = LoadState;
  state$ = new BehaviorSubject<{
    state: LoadState;
    data: any;
  }>({
    state: LoadState.Loading,
    data: []
  });

  ngOnInit() {
    this.state.user$
      .pipe(
        switchMap(user => {
          this.state$.next({
            state: LoadState.Loading,
            data: []
          });

          /**
           * If the user has items in his wish list
           * we populate them with products from
           */
          if (user.customerData.wishList) {
            return forkJoin(
              user.customerData.wishList.map(id =>
                this.afs
                  .doc(
                    `${FirestoreCollections.Products}-${
                      STATIC_CONFIG.lang
                    }/${id}`
                  )
                  .get()
                  .pipe(
                    map(product => ({
                      id,
                      ...product.data()
                    }))
                  )
              )
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe(res => {
        this.state$.next({
          state: res.length ? LoadState.Loaded : LoadState.Empty,
          data: res
        });
      });
  }
}
