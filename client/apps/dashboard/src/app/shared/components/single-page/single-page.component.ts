import {OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {notify} from '@jf/utils/notify.operator';
import {from} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {StateService} from '../../services/state/state.service';

export class SinglePageComponent implements OnInit {
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private state: StateService
  ) {}

  collection: FirestoreCollections;

  ngOnInit() {}

  cancel() {
    this.router.navigate(['/', this.collection]);
  }

  save(id) {
    this.state.language$
      .pipe(
        take(1),
        switchMap(lang =>
          from(
            this.afs
              .collection<any>(this.collection)
              .doc(id)
              .set(id.name, id.description)
          )
        ),
        notify()
      )
      .subscribe(() => {
        this.router.navigate(['/', this.collection]);
      });
  }
}
