import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-overview',
  templateUrl: './customers-overview.component.html',
  styleUrls: ['./customers-overview.component.css']
})
export class CustomersOverviewComponent extends RxDestroy implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {
    super();
  }

  data$: Observable<any>;

  ngOnInit() {
    this.data$ = this.activatedRoute.params.pipe(
      switchMap(user =>
        forkJoin(
          this.afs
            .doc(`${FirestoreCollections.Customers}/${user.id}`)
            .get()
            .pipe(
              map(res => ({
                id: res.id,
                ...res.data()
              }))
            ),
          this.afs
            .collection(FirestoreCollections.Orders, ref =>
              ref.where('customerId', FirebaseOperator.Equal, user.id)
            )
            .get()
            .pipe(
              map(actions =>
                actions.docs.map(action => ({
                  id: action.id,
                  ...action.data()
                }))
              )
            ),
          this.afs
            .collection(FirestoreCollections.Reviews, ref =>
              ref.where('customerId', FirebaseOperator.Equal, user.id)
            )
            .get()
            .pipe(
              map(actions =>
                actions.docs.map(action => ({
                  id: action.id,
                  ...action.data()
                }))
              )
            )
        )
      )
    );

    this.data$.subscribe(val => {
      console.log('v', val);
    });
  }
}
