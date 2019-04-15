import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RxDestroy} from '@jaspero/ng-helpers';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {notify} from '@jf/utils/notify.operator';
import * as nanoid from 'nanoid';
import {from, fromEvent, of} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './customers-single-page.component..html',
  styleUrls: ['./customers-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersSinglePageComponent extends RxDestroy implements OnInit {
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    super();
  }

  value: string;
  genders = ['Male', 'Female'];
  basicInfoForm: FormGroup;
  collection = FirestoreCollections.Customers;

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params.id !== 'create-single-post') {
            return this.afs
              .collection(`${FirestoreCollections.Customers}`)
              .doc(params.id)
              .valueChanges();
          } else {
            return of({});
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(data => {
        this.customerInfoForm(data);
        this.cdr.detectChanges();
      });
  }

  basicSubmit() {
    const id =
      this.activatedRoute.params['value'].id === 'new'
        ? nanoid()
        : this.activatedRoute.params['value'].id;
    const data = this.basicInfoForm.getRawValue();

    from(
      this.afs
        .collection(`${FirestoreCollections.Customers}`)
        .doc(id)
        .set(data)
    )
      .pipe(notify())
      .subscribe(() => {
        this.router.navigate(['/customers']);
      });
  }

  private customerInfoForm(data) {
    let date: any;

    if (data) {
      const num = new Date(data['dateOfBirth'].seconds).getTime();
      date = new Date(num * 1000);
    } else {
      date = '';
    }

    this.basicInfoForm = this.fb.group({
      name: [date ? data.name : '', Validators.required],
      dateOfBirth: [date || '', Validators.required],
      gender: [date ? data.gender : '', Validators.required],
      brief: [date ? data.brief : '', Validators.required]
    });
  }
}
