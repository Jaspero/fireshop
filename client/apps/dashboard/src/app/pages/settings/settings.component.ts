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
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {notify} from '@jf/utils/notify.operator';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format';
import {BehaviorSubject, forkJoin, from} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {CURRENCIES} from '../../shared/const/currency.const';

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
        statusUpdates: true,
        errorNotificationEmail: '',
        notifyOnShipped: true,
        notifyOnDelivered: true
      }
    },
    {
      collection: 'currency',
      defaultValues: {
        primary: 'USD',
        shippingCost: 0
      },
      transform: {
        shippingCost: value => (value ? fromStripeFormat(value) : 0)
      },
      compile: {
        shippingCost: value => (value ? toStripeFormat(value) : 0)
      }
    }
  ];

  static setFieldValue(group: any, key: string, value: any) {
    return group.transform && group.transform[key]
      ? group.transform[key](value)
      : value;
  }

  static getFieldValue(group: any, key: string, value: any) {
    return group.compile && group.compile[key]
      ? group.compile[key](value)
      : value;
  }

  get adminEmails() {
    return this.form.get('allowed-admins.emails');
  }

  get currencySymbol() {
    return CURRENCIES.find(
      cur => cur.value === this.form.get('currency.primary').value
    ).symbol;
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
              const value = SettingsComponent.setFieldValue(
                cur,
                key,
                entryDate[key] || cur.defaultValues[key]
              );

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

    const updated: any = {};

    forkJoin(
      this.groups.map(group => {
        const data = (this.form.get(
          group.collection
        ) as FormGroup).getRawValue();

        Object.keys(data).forEach(key => {
          data[key] = SettingsComponent.getFieldValue(group, key, data[key]);
        });

        updated[group.collection] = data;

        return from(
          this.afs
            .collection(FirestoreCollections.Settings)
            .doc(group.collection)
            .set(data, {
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
      .subscribe(() => {
        DYNAMIC_CONFIG.currency = updated['currency'];
      });
  }
}
