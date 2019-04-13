import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DeliveryStatusEnum} from '@jf/enums/delivery-status.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {ListComponent} from '../../../../shared/components/list/list.component';
import {Order} from '../../../../shared/interfaces/orders.interface';

@Component({
  selector: 'jfsc-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListComponent extends ListComponent<Order> {
  displayedColumns = [
    'checkBox',
    'customer',
    'customerId',
    'orderId',
    'time',
    'statusChange',
    'actions'
  ];

  collection = FirestoreCollections.Orders;
  deliveryStatus = DeliveryStatusEnum;

  changeClient(val, element) {
    this.afs
      .collection(`${FirestoreCollections.Orders}`)
      .doc(element.orderId)
      .set({
        customerId: element.customerId,
        orderId: element.orderId,
        status: val
      })
      .finally(() => {
        console.log('you changed order status to ' + val);
      });
  }
}
