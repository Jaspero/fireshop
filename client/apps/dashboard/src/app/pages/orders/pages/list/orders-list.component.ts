import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {Order} from '@jf/interfaces/order.interface';
import {merge} from 'rxjs';
import {ListComponent} from '../../../../shared/components/list/list.component';

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
    'email',
    'price',
    'time',
    'statusChange',
    'actions'
  ];

  collection = FirestoreCollections.Orders;
  deliveryStatus = OrderStatus;

  changeClient(val, element) {
    this.afs
      .collection(FirestoreCollections.Orders)
      .doc(element)
      .set(
        {
          status: val
        },
        {
          merge: true
        }
      );
  }
}
