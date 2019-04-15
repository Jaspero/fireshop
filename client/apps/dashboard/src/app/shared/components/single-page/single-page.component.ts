import {ChangeDetectorRef, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {notify} from '@jf/utils/notify.operator';
import * as nanoid from 'nanoid';
import {from, of} from 'rxjs';
import {switchMap, take, takeUntil} from 'rxjs/operators';
import {StateService} from '../../services/state/state.service';

export class SinglePageComponent extends RxDestroy implements OnInit {
  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public state: StateService,
    public activatedRoute: ActivatedRoute,
    public cdr: ChangeDetectorRef
  ) {
    super();
  }

  collection: FirestoreCollections;

  ngOnInit() {
    // works for customers

    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params.id !== 'new') {
            return this.afs
              .collection(`${this.collection}-${params}`)
              .doc(params.id)
              .valueChanges();
          } else {
            return of({});
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(data => {
        this.buildForm();
        this.cdr.detectChanges();
      });
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

  buildForm() {}

  cancel() {
    this.router.navigate(['/', this.collection]);
  }
}
