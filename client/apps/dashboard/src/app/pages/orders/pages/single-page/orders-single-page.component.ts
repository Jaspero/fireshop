import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {fromStripeFormat} from '@jf/utils/stripe-format';
import {takeUntil} from 'rxjs/operators';
import {SinglePageComponent} from '../../../../shared/components/single-page/single-page.component';

@Component({
  selector: 'jfsc-single-page',
  templateUrl: './orders-single-page.component.html',
  styleUrls: ['./orders-single-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersSinglePageComponent extends SinglePageComponent
  implements OnInit {
  collection = FirestoreCollections.Orders;
  deliveryStatus = OrderStatus;

  get ordersItemForms() {
    return this.form.get('orderItemsData') as FormArray;
  }

  buildForm(data: any) {
    console.log('data', data);
    this.form = this.fb.group({
      billing: this.checkForm(data.billing ? data.billing : {}),
      shippingInfo: data.shippingInfo || true,
      customerInfo: data.customerInfo || '',
      email: data.email || '',
      id: data.id || '',
      paymentIntentId: {value: data.paymentIntentId || '', disabled: true},
      price: data.price ? fromStripeFormat(data.price.total) : '',
      status: data.status || '',
      orderItemsData: this.fb.array(
        data.orderItemsData
          ? data.orderItemsData.map(x => this.fb.group(this.itemGroup(x)))
          : []
      )
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
            this.checkForm(value.shipping || {})
          );
        }
      });
  }

  testera() {
    console.log(this.form.getRawValue());
  }

  checkForm(data: any) {
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

  addItem() {
    const order = this.fb.group(this.itemGroup({}));
    this.ordersItemForms.push(order);
  }

  itemGroup(data) {
    return {
      id: data.productId || '',
      quantity: data.quantity || '',
      price: data.price || '',
      name: data.name || ''
    };
  }

  deleteItem(i) {
    this.ordersItemForms.removeAt(i);
  }
}
