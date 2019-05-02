import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormArray} from '@angular/forms';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
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

  get ordersForms() {
    return this.form.get('orders') as FormArray;
  }

  buildForm(data: any) {
    this.form = this.fb.group({
      billing: this.checkForm(data.billing ? data.billing : {}),
      shippingInfo: data.shippingInfo || true,
      createdOn: data.createdOn || '',
      customerId: data.customerId || '',
      customerName: data.customerName || '',
      email: data.email || '',
      id: data.id || '',
      paymentIntentId: data.paymentIntentId || '',
      price: data.price || '',
      status: data.status || '',
      orders: this.fb.array(
        data.orderItems ? data.orderItems.map(x => this.fb.group(x)) : []
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

  addOrder() {
    const order = this.fb.group({
      name: '',
      quantity: 0
    });
    this.ordersForms.push(order);
  }

  deleteOrder(i) {
    this.ordersForms.removeAt(i);
  }
}
