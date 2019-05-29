import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-gift-card-overview',
  templateUrl: './gift-card-overview.component.html',
  styleUrls: ['./gift-card-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardOverviewComponent implements OnInit {
  constructor(
    public activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  giftCards$: Observable<any>;

  ngOnInit() {
    this.giftCards$ = this.activatedRoute.params.pipe(
      switchMap(params =>
        this.afs
          .collection(FirestoreCollections.GiftCardsInstances, ref =>
            ref.where('giftCardId', FirebaseOperator.Equal, params.id)
          )
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(action => ({
                id: action.payload.doc.id,
                ...action.payload.doc.data()
              }))
            )
          )
      )
    );
  }
}
