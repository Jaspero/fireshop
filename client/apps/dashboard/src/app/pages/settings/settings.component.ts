import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RxDestroy} from '@jaspero/ng-helpers';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '@jf/enums/firestore-static-documents.enum';
import {notify} from '@jf/utils/notify.operator';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format';
import {BehaviorSubject, forkJoin, from} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {CURRENCIES} from '../../shared/const/currency.const';
import {Role} from '../../shared/enums/role.enum';
import {hasDuplicates} from '../../shared/utils/has-duplicates';

interface UserRole {
  email: string;
  role: Role;
}

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
  loading$ = new BehaviorSubject(false);
  groups = [
    {
      collection: FirestoreStaticDocuments.UserSettings,
      defaultValues: {
        roles: []
      },
      transform: {
        roles: value => this.fb.array(value.map(val => this.createRole(val)))
      },
      groupSettings: {
        validators: [this.uniqueEmails()]
      }
    },
    {
      collection: FirestoreStaticDocuments.GeneralSettings,
      defaultValues: {
        autoReduceQuantity: true,
        inactiveForQuantity: true,
        statusUpdates: true,
        errorNotificationEmail: '',
        notifyOnShipped: true,
        notifyOnDelivered: true,
        showingQuantity: true,
        description: 'Purchase from fireShop website',
        statementDescription: 'Fireshop purchase',
        allowOutOfQuantityPurchase: false
      }
    },
    {
      collection: FirestoreStaticDocuments.CurrencySettings,
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
  role = Role;

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

  get roles() {
    return this.form.get('user.roles') as FormArray;
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

            acc[cur.collection] = this.fb.group(
              finalData,
              cur.groupSettings || {}
            );

            return acc;
          }, {})
        );

        this.cdr.detectChanges();
      });
  }

  uniqueEmails() {
    return (control: FormGroup) => {
      const users = (control.get('roles') as FormArray).getRawValue();
      return hasDuplicates(users.map(user => user.email))
        ? {duplicates: true}
        : null;
    };
  }

  createRole(role: Partial<UserRole> = {}) {
    return this.fb.group({
      email: [role.email || '', [Validators.required, Validators.email]],
      role: [role.role || Role.Read]
    });
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
