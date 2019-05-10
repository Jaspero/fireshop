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
import {Customer} from '@jf/interfaces/customer.interface';
import {Order} from '@jf/interfaces/order.interface';
import {combineLatest, Observable} from 'rxjs';
import {map, shareReplay, startWith} from 'rxjs/operators';
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
    'customer',
    'price',
    'statusChange',
    'actions'
  ];

  @Output()
  optionSelected: EventEmitter<MatAutocompleteSelectedEvent>;

  collection = FirestoreCollections.Orders;
  deliveryStatus = OrderStatus;
  customers$: Observable<Customer[]>;
  filteredCustomers$: Observable<Customer[]>;
  additionalRouteData = {
    filters: {
      search: '',
      customers: '',
      status: ''
    }
  };

  ngOnInit() {
    super.ngOnInit();

    this.customers$ = this.afs
      .collection<Customer>(FirestoreCollections.Customers)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => ({
            id: action.payload.doc.id,
            ...action.payload.doc.data()
          }));
        }),
        shareReplay(1)
      );

    this.filteredCustomers$ = combineLatest(
      this.customers$,
      this.filters.get('customers').valueChanges.pipe(
        startWith(this.options.filters.customers || ''),
        map(value => value.toLowerCase())
      )
    ).pipe(
      map(([customers, value]) =>
        customers.filter(customer =>
          (customer.name || '').toLowerCase().includes(value)
        )
      )
    );
  }

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

  changeClient(status: OrderStatus, id: string) {
    this.afs
      .collection(FirestoreCollections.Orders)
      .doc(id)
      .set({status}, {merge: true});
  }
}
