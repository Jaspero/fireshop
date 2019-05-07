import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Customer} from '@jf/interfaces/customer.interface';
import {ListComponent} from '../../../../shared/components/list/list.component';

@Component({
  selector: 'jfsc-customer-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent extends ListComponent<Customer> {
  displayedColumns = [
    'checkBox',
    'createdOn',
    'name',
    'email',
    'gender',
    'actions'
  ];
  collection = FirestoreCollections.Customers;

  ngOnInit() {
    super.ngOnInit();
    this.filters.valueChanges.subscribe(value => {
      console.log('value', value);
    });
  }
}
