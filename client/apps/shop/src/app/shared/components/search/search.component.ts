import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {STATIC_CONFIG} from '@jf/consts/static-config.const';
import {FirebaseOperator} from '@jf/enums/firebase-operator.enum';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {Product} from '@jf/interfaces/product.interface';

@Component({
  selector: 'jfs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.afs
      .collection<Product>(
        `${FirestoreCollections.Products}-${STATIC_CONFIG.lang}`,
        ref => {
          return ref.where('name', FirebaseOperator.LargerThenOrEqual, 'b');
        }
      )
      .valueChanges()
      .subscribe();
  }
}
