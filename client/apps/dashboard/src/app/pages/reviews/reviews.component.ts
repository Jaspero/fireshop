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
    'productId',
    'customerId',
    'comment',
    'rating',
    'createdOn',
    'actions'
  ];
  collection = FirestoreCollections.Reviews;

  runFilters(ref) {
    if (this.options.filters.search) {
      ref = ref.where(
        'comment',
        FirebaseOperator.LargerThenOrEqual,
        this.options.filters.search
      );
    }

    return ref;
  }
}
