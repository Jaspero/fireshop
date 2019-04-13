import {Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Discount} from '../../../../../../../shop/src/app/shared/interfaces/discount.interface';
import {LangListComponent} from '../../../../shared/components/lang-list/lang-list.component';

@Component({
  selector: 'jfsc-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.css']
})
export class DiscountsListComponent extends LangListComponent<Discount> {
  displayedColumns: string[] = [
    'checkBox',
    'id',
    'name',
    'description',
    'actions'
  ];
  collection = FirestoreCollections.Discounts;
}
