import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import {takeUntil} from 'rxjs/operators';

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
      id: data.id || '',
      name: data.name || '',
      gender: data.gender || '',
      bio: data.bio || '',
      billing: this.addressForm(data.billing ? data.billing : {}),
      shippingInfo: data.shippingInfo || true
    });

    this.form
      .get('shippingInfo')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        if (value) {
          this.form.removeControl('shipping');
        } else {
          this.form.addControl(
            'shipping',
            this.addressForm(value.shipping || {})
          );
        }
      });
  }

  addressForm(data: any) {
    return this.fb.group({
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || '',
      zip: data.zip || '',
      country: data.country || '',
      line1: data.line1 || '',
      line2: data.line2 || ''
    });
  }

  duplicate(form) {
    this.router.navigate(['customers/copy' + '_' + form.controls.id.value]);
  }
}
