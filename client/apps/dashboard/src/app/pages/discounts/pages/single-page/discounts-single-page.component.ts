import {ChangeDetectorRef, Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import {URL_REGEX} from '../../../../shared/const/url-regex.const';
import {StateService} from '../../../../shared/services/state/state.service';

@Component({
  selector: 'jfsc-discounts-single-page',
  templateUrl: './discounts-single-page.component.html',
  styleUrls: ['./discounts-single-page.component.scss']
})
export class DiscountsSinglePageComponent extends SinglePageComponent {
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private state: StateService
  ) {
    super(router, afs, state, activatedRoute, cdr, fb);
  }

  isEdit: boolean;
  collection = FirestoreCollections.Discounts;

  public buildForm(data: any) {
    this.form = this.fb.group({
      id: [
        {value: data.id, disabled: this.isEdit},
        [Validators.required, Validators.pattern(URL_REGEX)]
      ],
      name: [data.name || '', Validators.required],
      description: [data.description || '']
    });
  }
}
