import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {Product} from '@jf/interfaces/product.interface';
import {fromStripeFormat, toStripeFormat} from '@jf/utils/stripe-format.ts';
import {Observable} from 'rxjs';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import {FileUploadComponent} from '../../../../shared/modules/file-upload/component/file-upload.component';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './products-single-page.component.html',
  styleUrls: ['./products-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSinglePageComponent extends LangSinglePageComponent
  implements OnInit {
  @ViewChild(FileUploadComponent)
  fileUploadComponent: FileUploadComponent;

  categories$: Observable<Category[]>;
  collection = FirestoreCollections.Products;

  ngOnInit() {
    super.ngOnInit();

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

  // TODO: I think this can be done in a better way
  move(next = true) {
    this.state.language$
      .pipe(
        switchMap(lang => {
          const cursor = this.afs
            .collection<Product>(`${FirestoreCollections.Products}-${lang}`)
            .doc(this.isEdit).ref;

          return this.afs
            .collection<Product>(
              `${FirestoreCollections.Products}-${lang}`,
              ref => {
                const final = ref
                  .limit(2)
                  .orderBy('name', next ? 'desc' : 'asc');

                if (next) {
                  final.startAfter(cursor);
                }

                return final;
              }
            )
            .snapshotChanges();
        })
      )
      .subscribe(value => {
        if (value && value[1]) {
          this.router.navigate(['/products', value[1].payload.doc.id]);
        }
      });
  }

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

        return this.fileUploadComponent
          .save()
          .pipe(switchMap(() => super.getSaveData(...args)));
      })
    );
  }

  buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.isEdit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      active: data.active || false,
      price: [data.price ? fromStripeFormat(data.price) : 0, Validators.min(0)],
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      gallery: [data.gallery || []],
      quantity: [data.quantity || 0, Validators.min(0)],
      category: data.category
    });

    this.connectGuard();
  }
}
