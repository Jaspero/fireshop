import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './customers-single-page.component.html',
  styleUrls: ['./customers-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersSinglePageComponent extends SinglePageComponent {
  value: string;
  genders = ['Male', 'Female'];
  collection = FirestoreCollections.Customers;

  buildForm(data) {
    this.form = this.fb.group({
      name: [data ? data.name : '', Validators.required],
      dateOfBirth: [
        data && data.dateOfBirth ? new Date(data.dateOfBirth) : '',
        Validators.required
      ],
      gender: [data ? data.gender : '', Validators.required],
      brief: [data ? data.brief : '', Validators.required]
    });
  }
}
