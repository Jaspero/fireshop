import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../shared/components/single-page/single-page.component';
import {URL_REGEX} from '../../../shared/const/url-regex.const';
import {StateService} from '../../../shared/services/state/state.service';

@Component({
  selector: 'jfsc-categories-single-page',
  templateUrl: './categories-single-page.component.html',
  styleUrls: ['./categories-single-page.component.scss']
})
export class CategoriesSinglePageComponent extends SinglePageComponent
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
    super(router, afs, state, activatedRoute, cdr, fb);
  }

  collection = FirestoreCollections.Categories;

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
}
