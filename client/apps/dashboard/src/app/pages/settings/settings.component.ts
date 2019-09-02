import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit, TemplateRef, ViewChild
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {RxDestroy} from '@jaspero/ng-helpers';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '@jf/enums/firestore-static-documents.enum';
import {notify} from '@jf/utils/notify.operator';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format';
import {BehaviorSubject, forkJoin, from, of} from 'rxjs';
import {finalize, map, takeUntil, tap} from 'rxjs/operators';
import {CURRENCIES} from '../../shared/const/currency.const';
import {Role} from '../../shared/enums/role.enum';
import {hasDuplicates} from '../../shared/utils/has-duplicates';
import {EMAIL_TAG_COLORS} from './consts/email-tag-colors.const';
import {EMAIL_TEMPLATES} from './consts/email-templates.const';
import {EmailTemplate} from './interfaces/email-template.interface';

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
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    super();
  }

  @ViewChild('emailTemplate', {static: true})
  emailTemplate: TemplateRef<any>;

  @ViewChild('emailTemplateData', {static: true})
  emailTemplateData: TemplateRef<any>;

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

  emailTemplates = EMAIL_TEMPLATES;
  emailTagColors = EMAIL_TAG_COLORS;
  emailTemplateCache: {
    [id: string]: {
      exampleData?: any;
      template?: string;
    }
  } = {};
  selectedTemplate: EmailTemplate;
  selectedTemplateController: FormControl;

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

  editTemplate(template: EmailTemplate) {
    return () => {

      this.selectedTemplate = template;

      return ((
        this.emailTemplateCache[template.id] && this.emailTemplateCache[template.id].template ?
          of(this.emailTemplateCache[template.id].template) :
          this.afs.doc(`${FirestoreCollections.Settings}/${FirestoreStaticDocuments.Templates}/${FirestoreStaticDocuments.Templates}/${template.id}`).get()
            .pipe(
              map(res => res.exists ? res.data().value : '')
            )
      ) as any)
        .pipe(
          tap((res: string) => {
            if (!this.emailTemplateCache[template.id]) {
              this.emailTemplateCache[template.id] = {};
            }

            this.emailTemplateCache[template.id].template = res;
            this.selectedTemplateController = new FormControl(res, Validators.required);
            this.dialog.open(this.emailTemplate, {width: '800px'});
          })
        )
    }
  }

  editTemplateData(template: EmailTemplate) {
    return () => {

      this.selectedTemplate = template;

      return ((
        this.emailTemplateCache[template.id] && this.emailTemplateCache[template.id].exampleData ?
          of(this.emailTemplateCache[template.id].exampleData) :
          this.afs.doc(`${FirestoreCollections.Settings}/${FirestoreStaticDocuments.Templates}/${FirestoreStaticDocuments.TemplateData}/${template.id}`).get()
            .pipe(
              map(res => res.exists ? res.data().value : {})
            )
      ) as any)
        .pipe(
          tap(res => {
            if (!this.emailTemplateCache[template.id]) {
              this.emailTemplateCache[template.id] = {};
            }

            this.emailTemplateCache[template.id].exampleData = res;
            this.selectedTemplateController = new FormControl(res, Validators.required);

            this.dialog.open(this.emailTemplateData, {width: '800px'});
          })
        )
    }
  }

  sendExampleEmail(template: EmailTemplate) {
    return () => {

    }
  }

  saveTemplate() {
    return () => {

      const value = this.selectedTemplateController.value;

      return from(
        this.afs.doc(`${FirestoreCollections.Settings}/${FirestoreStaticDocuments.Templates}/${FirestoreStaticDocuments.Templates}/${this.selectedTemplate.id}`).set({
          value
        })
      )
        .pipe(
          notify(),
          tap(() => {
            this.emailTemplateCache[this.selectedTemplate.id].template = value;
            this.dialog.closeAll();
          })
        )
    }
  }

  saveTemplateData() {
    return () => {

      const value = this.selectedTemplateController.value;

      return from(
        this.afs.doc(`${FirestoreCollections.Settings}/${FirestoreStaticDocuments.Templates}/${FirestoreStaticDocuments.TemplateData}/${this.selectedTemplate.id}`).set({
          value
        })
      )
        .pipe(
          notify(),
          tap(() => {
            this.emailTemplateCache[this.selectedTemplate.id].exampleData = value;
            this.dialog.closeAll();
          })
        )
    }
  }
}
