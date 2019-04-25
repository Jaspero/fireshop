import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {ListComponent} from '../../../../shared/components/list/list.component';
import {Customer} from '../../../../shared/interfaces/customer.interface';

@Component({
  selector: 'jfsc-customer-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent extends ListComponent<Customer> {
  displayedColumns = ['checkBox', 'name', 'gender', 'createdOn', 'actions'];
  collection = FirestoreCollections.Customers;
}
