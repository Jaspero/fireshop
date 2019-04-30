import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {BehaviorSubject, forkJoin, from} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {CURRENCIES} from '../../shared/const/currency.const';
import {notify} from '@jf/utils/notify.operator';

@Component({
  selector: 'jfsc-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent extends RxDestroy implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  currencies = CURRENCIES;
  form: FormGroup;
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  alreadyAdmin = false;
  loading$ = new BehaviorSubject(false);
  groups = [
    {
      collection: 'allowed-admins',
      defaultValues: {
        emails: []
      }
    },
    {
      collection: 'general-settings',
      defaultValues: {
        autoReduceQuantity: true,
        inactiveForQuantity: true,
        realTimeData: true,
        statusUpdates: true,
        errorNotificationEmail: ''
      }
    },
    {
      collection: 'currency',
      defaultValues: {
        primary: 'USD'
      }
    }
  ];

  get adminEmails() {
    return this.form.get('allowed-admins.emails');
  }

  ngOnInit() {
    this.afs
      .collection(FirestoreCollections.Settings)
      .get()
      .subscribe(snapshot => {
        this.form = this.fb.group(
          this.groups.reduce((acc, cur) => {
            const document = snapshot.docs.find(
              doc => doc.id === cur.collection
            );
            const finalData = {};
            const entryDate = document ? document.data() : {};

            for (const key in cur.defaultValues) {
              const value = entryDate[key] || cur.defaultValues[key];
              finalData[key] = Array.isArray(value) ? [value] : value;
            }

            acc[cur.collection] = this.fb.group(finalData);

            return acc;
          }, {})
        );
        this.cdr.detectChanges();
      });
  }

  removeAdmin(index: number) {
    const admins = this.adminEmails.value as String[];
    admins.splice(index, 1);
    this.adminEmails.setValue(admins);
  }

  addAdmin(event: MatChipInputEvent) {
    const admins = this.adminEmails.value as String[];

    if (admins.includes(event.value)) {
      this.alreadyAdmin = true;
    } else {
      this.alreadyAdmin = false;
      admins.push(event.value);
      this.adminEmails.setValue(admins);
      this.emailControl.setValue('');
    }
  }

  save() {
    this.loading$.next(true);
    forkJoin(
      this.groups.map(group => {
        return from(
          this.afs
            .collection(FirestoreCollections.Settings)
            .doc(group.collection)
            .set((this.form.get(group.collection) as FormGroup).getRawValue(), {
              merge: true
            })
        );
      })
    )
      .pipe(
        notify(),
        finalize(() => this.loading$.next(false)),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }
}
