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
  sales$: Observable<Sale[]>;
  logInValid$ = new BehaviorSubject<boolean>(true);
  user$: Observable<LoggedInUser>;
  loading$ = new BehaviorSubject<boolean>(false);
  checkoutResult: Array<Errors> | Partial<Order>;
  language$ = new BehaviorSubject<Language>(STATIC_CONFIG.lang);
  currentRoute$ = new BehaviorSubject<{data: any; url: string}>({
    data: {},
    url: '/'
  });
  structuredData: any = {};
  serverState: any;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = combineLatest([this.afAuth.user, this.logInValid$]).pipe(
      switchMap(([user, loginValid]) => {
        if (loginValid && user) {
          return this.afs
            .doc(`${FirestoreCollections.Customers}/${user.uid}`)
            .get({
              source: 'server'
            })
            .pipe(
              map(doc => {
                return {authData: user, customerData: doc.data()};
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
      switchMap(lang => {
        return this.afs
          .collection<Sale>(`${FirestoreCollections.Sales}-${lang}`, ref => {
            return ref.where('active', FirebaseOperator.Equal, true);
          })
          .get();
      }),
      map(actions =>
        actions.docs.map(
          action =>
            ({
              id: action.id,
              ...action.data()
            } as Sale)
        )
      ),
      shareReplay(1)
    );
  }
}
