import {AngularFirestore} from '@angular/fire/firestore';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '@jf/enums/firestore-static-documents.enum';
import {CurrencySettings} from '@jf/interfaces/currency-settings.interface';
import {take} from 'rxjs/operators';

export async function appInit(afs: AngularFirestore) {
  try {
    DYNAMIC_CONFIG.currency = await afs
      .collection(FirestoreCollections.Settings)
      .doc<CurrencySettings>(FirestoreStaticDocuments.CurrencySettings)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
  } catch (e) {}

  return Promise.resolve();
}
