import {AngularFirestore} from '@angular/fire/firestore';
import {DYNAMIC_CONFIG} from '@jf/consts/dynamic-config.const';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {FirestoreStaticDocuments} from '@jf/enums/firestore-static-documents.enum';
import {CurrencySettings} from '@jf/interfaces/currency-settings.interface';
import {GeneralSettings} from '@jf/interfaces/general-settings.interface';
import {take} from 'rxjs/operators';

export async function appInit(afs: AngularFirestore) {
  try {
    const [currency, generalSettings] = await Promise.all([
      afs
        .collection(FirestoreCollections.Settings)
        .doc<CurrencySettings>(FirestoreStaticDocuments.CurrencySettings)
        .valueChanges()
        .pipe(take(1))
        .toPromise(),
      afs
        .collection(FirestoreCollections.Settings)
        .doc<GeneralSettings>(FirestoreStaticDocuments.GeneralSettings)
        .valueChanges()
        .pipe(take(1))
        .toPromise()
    ]);

    DYNAMIC_CONFIG.currency = currency;
    DYNAMIC_CONFIG.generalSettings = generalSettings;
  } catch (e) {}

  return Promise.resolve();
}
