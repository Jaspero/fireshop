import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {LangSinglePageComponent} from '../../../../shared/components/lang-single-page/lang-single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import {Product} from '../../../../shared/interfaces/product.interface';
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

  form: FormGroup;
  categories$: Observable<Category[]>;
  loading$ = new BehaviorSubject(false);
  isEdit: string;
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
      })
    );
  }

  // TODO: I think this can be done in a better way
  move(next = true) {
    console.log('next', next);
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

  buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.isEdit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      active: data.active || false,
      price: [data.price || 0, Validators.min(0)],
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      gallery: [data.gallery || []],
      quantity: [data.quantity || 0, Validators.min(0)],
      category: data.category
    });
  }
}
