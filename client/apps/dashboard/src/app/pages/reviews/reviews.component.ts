import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Review} from '@jf/interfaces/review.interface';
import {ListComponent} from '../../shared/components/list/list.component';

@Component({
  selector: 'jfsc-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent extends ListComponent<Review> {
  displayedColumns = [
    'checkBox',
    'createdOn',
    'rating',
    'productId',
    'customerName',
    'comment',
    'actions'
  ];
  collection = FirestoreCollections.Reviews;

  runFilters(ref) {
    if (this.options.filters.search) {
      ref = ref.where(
        'customerName',
        FirebaseOperator.LargerThenOrEqual,
        this.options.filters.search
      );
    }

    return ref;
  }
}
