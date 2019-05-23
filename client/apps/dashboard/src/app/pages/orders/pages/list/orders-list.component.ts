import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {OrderStatus} from '@jf/enums/order-status.enum';
import {Order} from '@jf/interfaces/order.interface';
import {ListComponent} from '../../../../shared/components/list/list.component';

@Component({
  selector: 'jfsc-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListComponent extends ListComponent<Order>
  implements OnInit {
  displayedColumns = [
    'checkBox',
    'id',
    'createdOn',
    'customerName',
    'price',
    'stripe',
    'status',
    'actions'
  ];

  @Output()
  optionSelected: EventEmitter<MatAutocompleteSelectedEvent>;

  collection = FirestoreCollections.Orders;
  deliveryStatus = OrderStatus;
  additionalRouteData = {
    filters: {
      search: '',
      customers: '',
      status: ''
    }
  };

  runFilters(ref): any {
    if (this.options.filters.customers) {
      ref = ref.where(
        'customerId',
        FirebaseOperator.Equal,
        this.options.filters.customers
      );
    }

    if (this.options.filters.status) {
      ref = ref.where(
        'status',
        FirebaseOperator.Equal,
        this.options.filters.status
      );
    }

    return super.runFilters(ref);
  }

  statusChanged(status: OrderStatus, id: string) {
    this.afs
      .collection(FirestoreCollections.Orders)
      .doc(id)
      .set({status}, {merge: true});
  }
}
