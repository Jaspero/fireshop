import {getCurrencySymbol} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {RxDestroy} from '@jaspero/ng-helpers';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '@jf/enums/firestore-static-documents.enum';
import {Country} from '@jf/interfaces/country.interface';
import {Shipping} from '@jf/interfaces/shipping.interface';
import {notify} from '@jf/utils/notify.operator';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format';
import {forkJoin, from, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {Role} from '../../shared/enums/role.enum';
import {hasDuplicates} from '../../shared/utils/has-duplicates';
import {EMAIL_TAG_COLORS} from './consts/email-tag-colors.const';
import {EMAIL_TEMPLATES} from './consts/email-templates.const';
import {EmailTag} from './enums/email-tag.enum';
import {Currency} from './interfaces/currency.interface';
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
    private dialog: MatDialog,
    private aff: AngularFireFunctions
  ) {
    super();
  }

  @ViewChild('emailTemplate', {static: true})
  emailTemplate: TemplateRef<any>;

  @ViewChild('emailTemplateData', {static: true})
  emailTemplateData: TemplateRef<any>;

  @ViewChild('shippingDialog', {static: true})
  shippingDialog: TemplateRef<any>;

  currencies$: Observable<Currency[]>;
  form: FormGroup;
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
        allowOutOfQuantityPurchase: false,
        relatedProducts: 3
      }
    },
    {
      collection: FirestoreStaticDocuments.CurrencySettings,
      defaultValues: {
        primary: 'USD',
        supportedCurrencies: ['USD'],
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

  emailTag = EmailTag;
  emailTemplates = EMAIL_TEMPLATES;
  emailTagColors = EMAIL_TAG_COLORS;
  emailEditorOptions = {
    valid_elements: '*[*]',
    valid_styles: '*[*]',
    entity_encoding: 'raw'
  };
  emailTemplateCache: {
    [id: string]: {
      exampleData?: any;
      template?: string;
    };
  } = {};
  selectedTemplate: EmailTemplate;
  selectedTemplateController: FormControl;
  shipping: Shipping[];
  shippingControl: FormArray;
  countries: Country[];

  private _snapshot: any;

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
    return getCurrencySymbol(this.form.get('currency.primary').value, 'narrow');
  }

  ngOnInit() {
    this.currencies$ = from(
      this.aff.functions.httpsCallable('currencies')()
    ).pipe(map((res: any) => res.data));

    this.afs
      .collection(FirestoreCollections.Settings)
      .get()
      .subscribe(snapshot => {
        this._snapshot = snapshot;

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
    return () => {
      const updated: any = {};
      const toExec: any = [
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
      ];

      if (this.shipping) {
        toExec.push(
          from(
            this.afs
              .collection(FirestoreCollections.Settings)
              .doc(FirestoreStaticDocuments.Shipping)
              .set({
                value: this.shipping
              })
          )
        );
      }

      return forkJoin(toExec).pipe(
        notify(),
        tap(() => {
          DYNAMIC_CONFIG.currency = updated['currency'];
        })
      );
    };
  }

  editTemplate(template: EmailTemplate) {
    return () => {
      this.selectedTemplate = template;

      return this.loadTemplate(template).pipe(
        tap(res => {
          this.selectedTemplateController = new FormControl(
            res,
            Validators.required
          );
          this.dialog.open(this.emailTemplate, {width: '800px'});
        })
      );
    };
  }

  editTemplateData(template: EmailTemplate) {
    return () => {
      this.selectedTemplate = template;

      return ((this.emailTemplateCache[template.id] &&
      this.emailTemplateCache[template.id].exampleData
        ? of(this.emailTemplateCache[template.id].exampleData)
        : this.afs
            .doc(
              [
                FirestoreCollections.Settings,
                FirestoreStaticDocuments.Templates,
                FirestoreStaticDocuments.TemplateData,
                template.id
              ].join('/')
            )
            .get()
            .pipe(
              map(res => (res.exists ? res.data().value : {}))
            )) as any).pipe(
        tap(res => {
          if (!this.emailTemplateCache[template.id]) {
            this.emailTemplateCache[template.id] = {};
          }

          this.emailTemplateCache[template.id].exampleData = res;
          this.selectedTemplateController = new FormControl(
            res,
            Validators.required
          );

          this.dialog.open(this.emailTemplateData, {width: '800px'});
        })
      );
    };
  }

  sendExampleEmail(temp: EmailTemplate, control?: FormControl) {
    return () => {
      const exec = (template: string) => {
        const func = this.aff.functions.httpsCallable('exampleEmail');
        return from(
          func({
            id: temp.id,
            email: this.form.get('general-settings.errorNotificationEmail')
              .value,
            subject: temp.title,
            template
          })
        ).pipe(notify());
      };

      if (control) {
        return exec(control.value);
      } else {
        return this.loadTemplate(temp).pipe(switchMap(res => exec(res)));
      }
    };
  }

  saveTemplate() {
    return () => {
      /**
       * Fix for tinymce escaping handlebars partials
       */
      const value = this.selectedTemplateController.value.replace(
        /{{&gt;/g,
        '{{>'
      );

      return from(
        this.afs
          .doc(
            [
              FirestoreCollections.Settings,
              FirestoreStaticDocuments.Templates,
              FirestoreStaticDocuments.Templates,
              this.selectedTemplate.id
            ].join('/')
          )
          .set({
            value
          })
      ).pipe(
        notify(),
        tap(() => {
          this.emailTemplateCache[this.selectedTemplate.id].template = value;
          this.dialog.closeAll();
        })
      );
    };
  }

  saveTemplateData() {
    return () => {
      const value = this.selectedTemplateController.value;

      return from(
        this.afs
          .doc(
            [
              FirestoreCollections.Settings,
              FirestoreStaticDocuments.Templates,
              FirestoreStaticDocuments.TemplateData,
              this.selectedTemplate.id
            ].join('/')
          )
          .set({
            value
          })
      ).pipe(
        notify(),
        tap(() => {
          this.emailTemplateCache[this.selectedTemplate.id].exampleData = value;
          this.dialog.closeAll();
        })
      );
    };
  }

  manageShipping() {
    return () => {
      const func = this.aff.functions.httpsCallable('countries');
      const document = this._snapshot.docs.find(
        it => it.id === FirestoreStaticDocuments.Shipping
      );
      const documentData = document ? document.data().value : null;

      let shipping: Shipping[];

      if (this.shipping) {
        shipping = [...this.shipping];
      } else if (documentData) {
        shipping = [...documentData];
      } else {
        shipping = [];
      }

      return from(func()).pipe(
        switchMap((value: any) => {
          this.countries = value.data;

          this.shippingControl = new FormArray(
            this.countries.map(country => {
              const setValue = shipping.find(it => it.code === country.code);

              return new FormControl(
                setValue ? fromStripeFormat(setValue.value) : 0
              );
            })
          );

          return this.dialog
            .open(this.shippingDialog, {width: '800px'})
            .afterClosed();
        }),
        tap(value => {
          if (value) {
            this.shipping = value.reduce((acc, cur, index) => {
              if (cur) {
                acc.push({
                  ...this.countries[index],
                  value: toStripeFormat(cur)
                });
              }

              return acc;
            }, []);
          }
        })
      );
    };
  }

  private loadTemplate(template: EmailTemplate): Observable<string> {
    return ((this.emailTemplateCache[template.id] &&
    this.emailTemplateCache[template.id].template
      ? of(this.emailTemplateCache[template.id].template)
      : this.afs
          .doc(
            [
              FirestoreCollections.Settings,
              FirestoreStaticDocuments.Templates,
              FirestoreStaticDocuments.Templates,
              template.id
            ].join('/')
          )
          .get()
          .pipe(map(res => (res.exists ? res.data().value : '')))) as any).pipe(
      tap((res: string) => {
        if (!this.emailTemplateCache[template.id]) {
          this.emailTemplateCache[template.id] = {};
        }

        this.emailTemplateCache[template.id].template = res;
      })
    );
  }
}
