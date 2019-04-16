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
import {of} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import {StateService} from '../../../../shared/services/state/state.service';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './customers-single-page.component.html',
  styleUrls: ['./customers-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersSinglePageComponent extends SinglePageComponent {
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private state: StateService
  ) {
    super(router, afs, state, activatedRoute, cdr);
  }

  value: string;
  genders = ['Male', 'Female'];
  collection = FirestoreCollections.Customers;

  public buildForm(data) {
    let date: any;

    if (data) {
      const num = new Date(data['dateOfBirth'].seconds).getTime();
      date = new Date(num * 1000);
    } else {
      date = '';
    }

    this.form = this.fb.group({
      name: [date ? data.name : '', Validators.required],
      dateOfBirth: [date || '', Validators.required],
      gender: [date ? data.gender : '', Validators.required],
      brief: [date ? data.brief : '', Validators.required]
    });
  }
}
