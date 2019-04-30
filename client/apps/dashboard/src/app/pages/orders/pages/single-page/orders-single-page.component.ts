import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {Validators} from '@angular/forms';
import {MatSort} from '@angular/material';
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
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'name',
    'customerId',
    'identifier',
    'orderId',
    'price',
    'productId',
    'quantity'
  ];
  order: any;

  collection = FirestoreCollections.Orders;
  deliveryStatus = OrderStatus;

  buildForm(data: any) {
    console.log(data);
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
      status: data.status || ''
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
}
