import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {GiftCard} from '@jf/interfaces/gift-card.interface';
import {ListComponent} from '../../../../shared/components/list/list.component';

@Component({
  selector: 'jfsc-gift-card-list',
  templateUrl: './gift-card-list.component.html',
  styleUrls: ['./gift-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardListComponent extends ListComponent<GiftCard> {
  displayedColumns = ['id', 'value'];
  collection = FirestoreCollections.GiftCards;
}
