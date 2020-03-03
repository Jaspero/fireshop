import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Product} from '@jf/interfaces/product.interface';

@Component({
  selector: 'jfsc-product-autocomplete',
  templateUrl: './product-autocomplete.component.html',
  styleUrls: ['./product-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductAutocompleteComponent {
  constructor(private afs: AngularFirestore) {}

  @Output()
  optionSelected = new EventEmitter<Product>();

  query(search: string) {
    return this.afs.collection(
      `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`,
      ref => {
        let final = ref.limit(5);

        if (search) {
          final = final.where('search', FirebaseOperator.ArrayContains, search);
        }

        return final;
      }
    );
  }

  select(event: any) {
    this.optionSelected.next(event as Product);
  }
}
