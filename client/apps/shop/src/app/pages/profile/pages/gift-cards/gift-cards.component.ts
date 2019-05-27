import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {GiftCard} from '@jf/interfaces/gift-card.interface';
import * as nanoid from 'nanoid';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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

  @ViewChild('giftTemplate') giftTemplate: TemplateRef<any>;

  giftCards$: Observable<any>;
  form: FormGroup;

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
  }

  buildForm() {
    this.form = this.fb.group({
      value: ['', Validators.required],
      email: ['', Validators.required],
      creditCard: ['', Validators.required]
    });
  }

  dialogOpen() {
    this.dialog.open(this.giftTemplate, {});
    this.buildForm();
  }

  buy() {
    const formData = this.form.getRawValue();
    const customerId = this.afAuth.auth.currentUser.uid;

    this.afs
      .collection(FirestoreCollections.GiftCardsInstances)
      .doc(nanoid())
      .set({
        formData,
        customerId: customerId
      });
  }
}
