import {getCurrencySymbol} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormArray, FormControl, Validators} from '@angular/forms';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format.ts';
import {Observable} from 'rxjs';
import {
  filter,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {ProductSelectDialogComponent} from '../../../../shared/components/product-select-dialog/product-select-dialog.component';
import {GalleryUploadComponent} from '../../../../shared/modules/file-upload/gallery-upload/gallery-upload.component';

interface Currency {
  code: string;
  symbol: string;
}

interface SelectedCurrency extends Currency {
  control: FormControl;
}

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './products-single-page.component.html',
  styleUrls: ['./products-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSinglePageComponent extends LangSinglePageComponent
  implements OnInit {
  @ViewChild(GalleryUploadComponent, {static: false})
  galleryUploadComponent: GalleryUploadComponent;

  categories$: Observable<Category[]>;
  collection = FirestoreCollections.Products;
  currencies: Currency[];
  inventoryKeys: string[] = [];
  colors = ['c-warm', 'c-primary', 'c-accent', 'c-primary'];

  selectedCurrency: SelectedCurrency;
  currencyControl: FormControl;

  ngOnInit() {
    super.ngOnInit();

    this.currencies = DYNAMIC_CONFIG.currency.supportedCurrencies.map(it => ({
      code: it,
      symbol: getCurrencySymbol(it, 'narrow')
    }));

    this.categories$ = this.state.language$.pipe(
      switchMap(lang =>
        this.afs
          .collection<Category>(`${FirestoreCollections.Categories}-${lang}`)
          .valueChanges({idField: 'id'})
      ),
      shareReplay(1)
    );
  }

  get attributesForms() {
    return this.form.get('attributes') as FormArray;
  }

  // TODO: I think this can be done in a better way
  // move(next = true) {
  //   this.state.language$
  //     .pipe(
  //       switchMap(lang => {
  //         const cursor = this.afs
  //           .collection<Product>(`${FirestoreCollections.Products}-${lang}`)
  //           .doc(this.viewState.Edit).ref;
  //
  //         return this.afs
  //           .collection<Product>(
  //             `${FirestoreCollections.Products}-${lang}`,
  //             ref => {
  //               const final = ref
  //                 .limit(2)
  //                 .orderBy('name', next ? 'desc' : 'asc');
  //
  //               if (next) {
  //                 final.startAfter(cursor);
  //               }
  //
  //               return final;
  //             }
  //           )
  //           .snapshotChanges();
  //       })
  //     )
  //     .subscribe(value => {
  //       if (value && value[1]) {
  //         this.router.navigate(['/products', value[1].payload.doc.id]);
  //       }
  //     });
  // }

  createId(): string {
    return this.form
      .get('name')
      .value.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  getSaveData(...args) {
    return this.categories$.pipe(
      take(1),
      switchMap(categories => {
        DYNAMIC_CONFIG.currency.supportedCurrencies.forEach(code => {
          args[1].price[code] = toStripeFormat(args[1].price[code]);
        });

        args[1].search = args[1].name
          .split(' ')
          .map(value => value.trim().toLowerCase());

        if (args[1].category) {
          const category = categories.find(cat => cat.id === args[1].category);

          if (category) {
            args[1].search.push(
              ...category.name
                .split(' ')
                .map(value => value.trim().toLowerCase())
            );
          }
        }

        /**
         * Format inventory price
         */
        if (args[1].inventory) {
          for (const key in args[1].inventory) {
            const pr = args[1].inventory[key].price;

            DYNAMIC_CONFIG.currency.supportedCurrencies.forEach(code => {
              pr[code] = toStripeFormat(pr[code]);
            });
          }
        }

        /**
         * Don't store empty objects in database
         */
        if (!Object.keys(args[1].attributes).length) {
          delete args[1].attributes;
          delete args[1].inventory;
          delete args[1].default;
        }

        return this.galleryUploadComponent.save().pipe(
          switchMap(() => {
            args[1].gallery = this.form.get('gallery').value;
            return super.getSaveData(...args);
          })
        );
      })
    );
  }

  buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.currentState === this.viewState.Edit}
      ],
      name: [data.name || '', Validators.required],
      active: data.active || false,
      price: this.setCurrencyGroup(data.price),
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      gallery: [data.gallery || []],
      quantity: [data.quantity || 0, Validators.min(0)],
      category: data.category,
      showingQuantity: data.hasOwnProperty('showingQuantity')
        ? data.showingQuantity
        : DYNAMIC_CONFIG.generalSettings.showingQuantity,
      allowOutOfQuantityPurchase: data.hasOwnProperty(
        'allowOutOfQuantityPurchase'
      )
        ? data.allowOutOfQuantityPurchase
        : DYNAMIC_CONFIG.generalSettings.allowOutOfQuantityPurchase,
      relatedProducts: [data.relatedProducts || []],
      attributes: this.fb.array(
        data.attributes
          ? data.attributes.map(x =>
              this.fb.group({
                key: x.key || '',
                list: [x.list || []]
              })
            )
          : []
      ),
      inventory: this.fb.group(
        data.inventory ? this.formatInventory(data.inventory, true) : {}
      ),
      default: data.default || ''
    });

    this.currencyControl = new FormControl(DYNAMIC_CONFIG.currency.primary);

    this.currencyControl.valueChanges
      .pipe(
        startWith(this.currencyControl.value),
        takeUntil(this.destroyed$)
      )
      .subscribe(code => {
        this.selectedCurrency = {
          code,
          control: this.form.get(`price.${code}`) as FormControl,
          symbol: getCurrencySymbol(code, 'narrow')
        };
        this.cdr.markForCheck();
      });
  }

  view(form) {
    window.open(environment.websiteUrl + '/product/' + form.controls.id.value);
  }

  addAttribute() {
    this.attributesForms.push(
      this.fb.group({
        key: '',
        list: [[]]
      })
    );
  }

  deleteAttribute(i) {
    this.attributesForms.removeAt(i);
    const obj = this.filterData();
    const listLength = this.attributesForms.value.length;

    let firstKey;

    for (const key in obj) {
      const splitArr = key.split('_');

      if (!firstKey) {
        firstKey = key;
      }

      if (splitArr.length !== listLength) {
        delete obj[key];
      }
    }

    this.form.get('default').setValue(Object.keys(obj)[0]);
    this.form.setControl('inventory', this.fb.group(this.formatInventory(obj)));
  }

  addAttributeValue(item, ind) {
    if (item.value) {
      const list = this.attributesForms.at(ind).get('list').value;

      list.push(item.value);

      this.attributesForms
        .at(ind)
        .get('list')
        .setValue(list);

      item.input.value = '';

      const obj = this.filterData();
      const listLength = this.attributesForms.value.length;
      const def = this.form.get('default');

      let valuesLength = 0;
      let firstKey;

      for (const key in obj) {
        if (!firstKey) {
          firstKey = key;
        }

        valuesLength++;

        const splitArr = key.split('_');

        if (splitArr.length < listLength) {
          delete obj[key];
        }
      }

      if (valuesLength && !def.value) {
        def.setValue(firstKey);
      }

      this.form.setControl(
        'inventory',
        this.fb.group(this.formatInventory(obj))
      );
    }
  }

  removeAttributeValue(attributeIndex: number, itemIndex: number, item) {
    const list = this.attributesForms.at(attributeIndex).get('list').value;
    list.splice(itemIndex, 1);
    this.attributesForms
      .at(attributeIndex)
      .get('list')
      .setValue(list);
    let obj = this.form.get('inventory').value;
    for (const key in obj) {
      const arr = key.split('_');
      if (arr[attributeIndex] === item) {
        delete obj[key];
      }
    }
    if (!obj[this.form.get('default').value]) {
      this.form.get('default').setValue(Object.keys(obj)[0]);
    }
    obj = this.formatInventory(obj);
    this.form.setControl('inventory', this.fb.group(obj));
  }

  labelFormat(key: string) {
    return key
      .split('_')
      .reduce(
        (acc, cur, ind) =>
          acc + ` <span class="${this.colors[ind]}">  ${cur}</span>`,
        ''
      );
  }

  relatedProducts() {
    const relatedProd = this.form.get('relatedProducts');

    this.dialog
      .open(ProductSelectDialogComponent, {
        width: '800px',
        autoFocus: false,
        data: {
          selected: relatedProd.value,
          title: 'Related Products'
        }
      })
      .afterClosed()
      .pipe(filter(value => value))
      .subscribe(value => {
        relatedProd.setValue(value);
        this.cdr.markForCheck();
      });
  }

  private setCurrencyGroup(price: {[key: string]: number}, adjustPrice = true) {
    return this.fb.group(
      DYNAMIC_CONFIG.currency.supportedCurrencies.reduce((acc, currency) => {
        const value = price && price[currency] ? price[currency] : 0;

        acc[currency] = new FormControl(
          adjustPrice ? fromStripeFormat(value) : value,
          Validators.min(0)
        );

        return acc;
      }, {})
    );
  }

  private filterData() {
    const price = this.form.get('price').value;
    const attributesData = this.attributesForms.getRawValue();

    return {
      ...attributesData.reduce((acc, cur) => {
        if (Object.keys(acc).length && cur.list.length) {
          for (const key in acc) {
            cur.list.forEach(y => {
              acc[`${key}_${y}`] = {
                quantity: 0,
                price
              };
            });
          }
        } else {
          cur.list.forEach(x => {
            acc[x] = {
              quantity: 0,
              price
            };
          });
        }
        return acc;
      }, {}),
      ...this.form.get('inventory').value
    };
  }

  private formatInventory(data: any, adjustPrice?: boolean) {
    const obj = {};
    this.inventoryKeys = [];
    for (const key in data) {
      this.inventoryKeys.push(key);
      obj[key] = this.fb.group({
        ...data[key],
        price: this.setCurrencyGroup(data[key].price, adjustPrice)
      });
    }
    return obj;
  }
}
