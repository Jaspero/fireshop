import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Sale} from '@jf/interfaces/sales.interface';
import {LangListComponent} from '../../../../shared/components/lang-list/lang-list.component';

@Component({
  selector: 'jfsc-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleListComponent extends LangListComponent<Sale> {
  displayedColumns: string[] = [
    'checkBox',
    'id',
    'createdOn',
    'name',
    'description',
    'actions'
  ];

  collection = FirestoreCollections.Sales;
}
