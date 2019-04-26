import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {forkJoin, of, Subject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Product} from '../../../../shared/interfaces/product.interface';
import {StateService} from '../../../../shared/services/state/state.service';
import {State} from '@jf/enums/state.enum';

@Component({
  selector: 'jfs-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishListComponent implements OnInit {
  constructor(private state: StateService, private afs: AngularFirestore) {}

  dataState = State;
  state$ = new Subject<{
    state: State;
    data: Product[];
  }>();

  ngOnInit() {
    this.state.user$
      .pipe(
        switchMap(user => {
          this.state$.next({
            state: State.Loading,
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
          state: res.length ? State.Loaded : State.Empty,
          data: res
        });
      });
  }
}
