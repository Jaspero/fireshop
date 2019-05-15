import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormArray, Validators} from '@angular/forms';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format.ts';
import {Observable} from 'rxjs';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {environment} from '../../../../../../../shop/src/environments/environment';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {CURRENCIES} from '../../../../shared/const/currency.const';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import {GalleryUploadComponent} from '../../../../shared/modules/file-upload/gallery-upload/gallery-upload.component';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './products-single-page.component.html',
  styleUrls: ['./products-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSinglePageComponent extends LangSinglePageComponent
  implements OnInit {
  @ViewChild(GalleryUploadComponent)
  galleryUploadComponent: GalleryUploadComponent;

  categories$: Observable<Category[]>;
  collection = FirestoreCollections.Products;
  currency: string;
  inventoryKeys: string[] = [];
  colors = ['c-warm', 'c-primary', 'c-accent', 'c-primary'];

  ngOnInit() {
    super.ngOnInit();
    this.currency = CURRENCIES.find(
      cur => cur.value === DYNAMIC_CONFIG.currency.primary
    ).symbol;

    this.categories$ = this.state.language$.pipe(
      switchMap(lang =>
        this.afs
          .collection<Category>(`${FirestoreCollections.Categories}-${lang}`)
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

  getSaveData(...args) {
    return this.categories$.pipe(
      take(1),
      switchMap(categories => {
        args[1].price = toStripeFormat(args[1].price);
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
    console.log('data', data);
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.currentState === this.viewState.Edit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      active: data.active || false,
      price: [data.price ? fromStripeFormat(data.price) : 0, Validators.min(0)],
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      gallery: [data.gallery || []],
      quantity: [data.quantity || 0, Validators.min(0)],
      category: data.category,
      showingQuantity: data.hasOwnProperty('showingQuantity')
        ? data.showingQuantity
        : DYNAMIC_CONFIG.generalSettings.showingQuantity,
      allowOutOfQuantityPurchase: data.hasOwnProperty(
        'allowOutOfQuantityPurchase '
      )
        ? data.allowOutOfQuantityPurchase
        : DYNAMIC_CONFIG.generalSettings.allowOutOfQuantityPurchase,
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
        data.inventory ? this.formatInventory(data.inventory) : {}
      )
    });

    console.log(111, this.form.getRawValue());
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

  delAttribute(i) {
    this.attributesForms.removeAt(i);
  }

  add(item, ind) {
    const input = item.input;
    const value = item.value;

    if (value) {
      const list = this.attributesForms.at(ind).get('list').value;
      list.push(value);
      this.attributesForms
        .at(ind)
        .get('list')
        .setValue(list);
      input.value = '';

      let obj = {};
      this.attributesForms.getRawValue().map(val => {
        if (Object.keys(obj).length && val.list.length) {
          for (let key in obj) {
            val.list.forEach(y => {
              obj[`${key}_${y}`] = {
                quantity: 0
              };
            });
          }
        } else {
          val.list.forEach(x => {
            obj[x] = {
              quantity: 0
            };
          });
        }
      });

      const inventory = this.form.get('inventory');
      obj = {...obj, ...inventory.value};
      const listLength = this.attributesForms.value.length;
      for (const key in obj) {
        const mama = key.split('_');
        if (mama.length < listLength) {
          delete obj[key];
        }
      }
      obj = this.formatInventory(obj);
      this.form.setControl('inventory', this.fb.group(obj));
    }
  }

  formatInventory(data) {
    const obj = {};
    for (const key in data) {
      obj[key] = this.fb.group(data[key]);
    }
    this.inventoryKeys = Object.keys(data);
    return obj;
  }

  remove(ind, index, item) {
    const list = this.attributesForms.at(ind).get('list').value;
    list.splice(index, 1);
    this.attributesForms
      .at(ind)
      .get('list')
      .setValue(list);
    let obj = this.form.get('inventory').value;
    for (const key in obj) {
      const arr = key.split('_');
      if (arr[ind] === item) {
        delete obj[key];
      }
    }
    obj = this.formatInventory(obj);
    this.form.setControl('inventory', this.fb.group(obj));
  }

  labelFormat(key: string) {
    let finale = '';
    const str = key.split('_');
    str.forEach((x, ind) => {
      finale = finale + ` <span class="${this.colors[ind]}">  ${x}</span>`;
    });
    return finale;
  }
}
