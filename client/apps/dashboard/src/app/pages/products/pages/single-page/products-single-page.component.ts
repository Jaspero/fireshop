import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Category} from '@jf/interfaces/category.interface';
import {notify} from '@jf/utils/notify.operator';
import {BehaviorSubject, combineLatest, from, Observable, of} from 'rxjs';
import {finalize, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import {Product} from '../../../../shared/interfaces/product.interface';
import {FileUploadComponent} from '../../../../shared/modules/file-upload/component/file-upload.component';
import {StateService} from '../../../../shared/services/state/state.service';
import {queue} from '../../../../shared/utils/queue.operator';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './products-single-page.component.html',
  styleUrls: ['./products-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSinglePageComponent extends RxDestroy implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private state: StateService,
    private router: Router
  ) {
    super();
  }

  @ViewChild(FileUploadComponent)
  fileUploadComponent: FileUploadComponent;

  form: FormGroup;
  categories$: Observable<Category[]>;
  loading$ = new BehaviorSubject(false);
  isEdit: string;

  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.state.language$)
      .pipe(
        switchMap(([params, lang]) => {
          this.categories$ = this.afs
            .collection<Category>(`${FirestoreCollections.Categories}-${lang}`)
            .snapshotChanges()
            .pipe(
              map(actions => {
                return actions.map(action => ({
                  id: action.payload.doc.id,
                  ...action.payload.doc.data()
                }));
              })
            );

          if (params.id !== 'new') {
            this.isEdit = params.id;

            return this.afs
              .collection(`${FirestoreCollections.Products}-${lang}`)
              .doc(params.id)
              .valueChanges()
              .pipe(
                take(1),
                map(value => ({
                  ...value,
                  id: params.id
                })),
                queue()
              );
          } else {
            this.isEdit = '';

            return of({});
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(data => {
        this.buildForm(data);
        this.cdr.detectChanges();
      });
  }

  save() {
    this.loading$.next(true);
    this.state.language$
      .pipe(
        take(1),
        switchMap(lang => {
          return this.fileUploadComponent.save().pipe(
            switchMap(() => {
              const {id, ...data} = this.form.getRawValue();

              return from(
                this.afs
                  .collection<any>(`${FirestoreCollections.Products}-${lang}`)
                  .doc(id)
                  .set(
                    {
                      ...data,
                      ...(this.isEdit ? {} : {createdOn: Date.now()})
                    },
                    {
                      merge: true
                    }
                  )
              );
            })
          );
        }),
        finalize(() => this.loading$.next(false)),
        notify()
      )
      .subscribe(() => {
        this.router.navigate(['/products']);
      });
  }

  backToList(skipGuard = true) {
    if (skipGuard) {
    }

    this.router.navigate(['/products']);
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
