import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Language} from '@jf/enums/language.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {Errors, Order} from '@jf/interfaces/order.interface';
import {Sale} from '@jf/interfaces/sales.interface';
import {User} from 'firebase/app';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap
} from 'rxjs/operators';

export interface LoggedInUser {
  authData: User;
  customerData: Customer;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = combineLatest([this.afAuth.user, this.logInValid$]).pipe(
      switchMap(([user, loginValid]) => {
        if (loginValid && user) {
          return this.afs
            .doc(`${FirestoreCollections.Customers}/${user.uid}`)
            .valueChanges()
            .pipe(
              map(doc => {
                return {authData: user, customerData: doc};
              })
            );
        } else {
          return of(null);
        }
      }),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.sales$ = this.language$.pipe(
      switchMap(lang =>
        this.afs
          .collection<Sale>(`${FirestoreCollections.Sales}-${lang}`, ref => {
            ref.where('active', FirebaseOperator.Equal, true);
            ref.where(
              'startingDate',
              FirebaseOperator.SmallerThenOrEqual,
              this.currentDate
            );
            ref.where(
              'endingDate',
              FirebaseOperator.LargerThenOrEqual,
              this.currentDate
            );
            return ref;
          })
          .snapshotChanges()
      ),
      map(actions => {
        return actions.map(action => ({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        }));
      }),
      shareReplay(1)
    );
  }

  logInValid$ = new BehaviorSubject<boolean>(true);
  user$: Observable<LoggedInUser>;
  loading$ = new BehaviorSubject<boolean>(false);
  checkoutResult: Array<Errors> | Partial<Order>;
  language$ = new BehaviorSubject<Language>(STATIC_CONFIG.lang);
  sales$: Observable<Sale[]>;
  currentDate = Date.now();

  currentRoute$ = new BehaviorSubject<{data: any; url: string}>({
    data: {},
    url: '/'
  });

  structuredData: any = {};
}
