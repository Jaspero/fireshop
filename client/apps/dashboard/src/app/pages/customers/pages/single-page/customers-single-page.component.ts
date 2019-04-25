import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';
import {takeUntil} from 'rxjs/operators';
import {Subscription} from 'rxjs';

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
  private shippingSubscription: Subscription;

  buildForm(data) {
    const group = this.fb.group({
      billing: this.checkForm(data.billing ? data.billing : {}),
      shippingInfo: data.shippingInfo || true,
      gender: data.gender || '',
      bio: data.bio || ''
    });

    if (this.shippingSubscription) {
      this.shippingSubscription.unsubscribe();
    }
    this.shippingSubscription = group
      .get('shippingInfo')
      .valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(value => {
        if (value) {
          group.removeControl('shipping');
        } else {
          group.addControl('shipping', this.checkForm(value.shipping || {}));
        }
      });

    this.form = group;
  }

  checkForm(data: any) {
    return this.fb.group({
      firstName: [data.firstName || '', Validators.required],
      lastName: [data.lastName || '', Validators.required],
      email: [data.email || '', Validators.required],
      phone: [data.phone || '', Validators.required],
      city: [data.city || '', Validators.required],
      zip: [data.zip || '', Validators.required],
      country: [data.country || '', Validators.required],
      line1: [data.line1 || '', Validators.required],
      line2: [data.line2 || '']
    });
  }
}
