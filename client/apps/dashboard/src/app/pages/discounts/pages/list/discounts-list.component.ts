import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Discount} from '@jf/interfaces/discount.interface';
import {LangListComponent} from '../../../../shared/components/lang-list/lang-list.component';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {DiscountValueType} from '../single-page/discounts-single-page.component';

@Component({
  selector: 'jfsc-discounts-list',
  templateUrl: './discounts-list.component.html',
  styleUrls: ['./discounts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountsListComponent extends LangListComponent<Discount> {
  displayedColumns: string[] = [
    'checkBox',
    'id',
    'createdOn',
    'value',
    'name',
    'description',
    'actions'
  ];
  discountValueType = DiscountValueType;
  collection = FirestoreCollections.Discounts;
  primaryCurrency = DYNAMIC_CONFIG.currency.primary;
}
