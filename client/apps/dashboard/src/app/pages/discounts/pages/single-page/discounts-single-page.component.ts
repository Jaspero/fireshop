import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {combineLatest, from, of} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '@jf/utils/notify.operator';

@Component({
  selector: 'jfsc-discounts-single-page',
  templateUrl: './discounts-single-page.component.html',
  styleUrls: ['./discounts-single-page.component.css']
})
export class DiscountsSinglePageComponent extends SinglePageComponent
  implements OnInit {
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private state: StateService
  ) {
    super(afs, router, state);
  }

  form: FormGroup;
  isEdit: boolean;
  collection = FirestoreCollections.Discounts;

  ngOnInit() {
    combineLatest(this.activatedRoute.params, this.state.language$)
      .pipe(
        switchMap(([params, lang]) => {
          if (params.id !== 'new') {
            this.isEdit = true;
            return this.afs
              .collection(`${FirestoreCollections.Discounts}-${lang}`)
              .doc(params.id)
              .valueChanges()
              .pipe(
                map(value => ({
                  ...value,
                  id: params.id
                }))
              );
          } else {
            this.isEdit = false;
            return of({});
          }
        })
      )
      .subscribe(data => {
        this.buildForm(data);
        this.cdr.detectChanges();
      });
  }

  buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.isEdit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      description: [data.description || '']
    });
  }

  // save() {
  //   const {id, ...data} = this.form.getRawValue();
  //
  //   this.state.language$
  //     .pipe(
  //       take(1),
  //       switchMap(lang =>
  //         from(
  //           this.afs
  //             .collection<any>(`${FirestoreCollections.Discounts}-${lang}`)
  //             .doc(id)
  //             .set(data)
  //         )
  //       ),
  //       notify()
  //     )
  //     .subscribe(() => {
  //       this.router.navigate(['/discounts']);
  //     });
  // }
}
