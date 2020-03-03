import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {GiftCard} from '@jf/interfaces/gift-card.interface';
import {notify} from '@jf/utils/notify.operator';
import * as nanoid from 'nanoid';
import {from, Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfs-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardsComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private afAuth: AngularFireAuth
  ) {}

  @ViewChild('giftTemplate')
  giftTemplate: TemplateRef<any>;

  @ViewChild('applyTemplate')
  applyTemplate: TemplateRef<any>;

  giftCards$: Observable<any>;
  giftCardsInstances$: Observable<any>;
  form: FormGroup;
  code: FormControl;

  ngOnInit() {
    this.giftCards$ = this.afs
      .collection<any>(FirestoreCollections.GiftCards)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => ({
            id: action.payload.doc.id,
            ...(action.payload.doc.data() as GiftCard)
          }))
        )
      );

    this.giftCardsInstances$ = this.afs
      .collection<any>(FirestoreCollections.GiftCardsInstances, ref =>
        ref.where(
          'usedBy',
          FirebaseOperator.Equal,
          this.afAuth.auth.currentUser.uid
        )
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => ({
            id: action.payload.doc.id,
            ...action.payload.doc.data()
          }))
        )
      );
  }

  buildForm() {
    this.form = this.fb.group({
      giftCardId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      creditCard: ['', Validators.required]
    });

    this.code = new FormControl('');
  }

  dialogBuyOpen() {
    this.dialog.open(this.giftTemplate);
    this.buildForm();
  }

  dialogApplyOpen() {
    this.dialog.open(this.applyTemplate);
    this.buildForm();
  }

  buy() {
    const formData = this.form.getRawValue();
    const customerId = this.afAuth.auth.currentUser.uid;

    from(
      this.afs
        .collection(FirestoreCollections.GiftCardsInstances)
        .doc(nanoid())
        .set({
          ...formData,
          customerId
        })
    )
      .pipe(notify())
      .subscribe();
  }

  apply() {
    const code = this.code.value;
    const customerId = this.afAuth.auth.currentUser.uid;

    this.afs
      .collection(FirestoreCollections.GiftCardsInstances)
      .doc(code)
      .get()
      .pipe(
        filter(value => value.exists),
        switchMap(() =>
          from(
            this.afs
              .collection(FirestoreCollections.GiftCardsInstances)
              .doc(code)
              .set(
                {
                  usedBy: customerId
                },
                {
                  merge: true
                }
              )
          )
        ),
        notify()
      )
      .subscribe();
  }
}
