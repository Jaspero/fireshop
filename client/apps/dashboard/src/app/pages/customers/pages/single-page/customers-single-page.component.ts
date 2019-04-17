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
    let date: any;

    if (data) {
      const num = new Date(data['dateOfBirth']).getTime();
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
