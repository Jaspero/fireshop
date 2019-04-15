import {OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {notify} from '@jf/utils/notify.operator';
import {from} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {StateService} from '../../services/state/state.service';
import * as nanoid from 'nanoid';

export class SinglePageComponent extends RxDestroy implements OnInit {
  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public state: StateService
  ) {
    super();
  }

  collection: FirestoreCollections;

  ngOnInit() {}

  cancel() {
    this.router.navigate(['/', this.collection]);
  }

  save(item) {
    console.log(item, 'item');

    this.state.language$
      .pipe(
        take(1),
        switchMap(lang =>
          from(
            this.afs
              .collection(`${this.collection}-${lang}`)
              .doc(item.id ? item.id : nanoid())
              .set(item)
          )
        ),
        notify()
      )
      .subscribe(() => {
        this.router.navigate(['/', this.collection]);
      });
  }
}
