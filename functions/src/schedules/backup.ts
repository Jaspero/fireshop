import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {unlinkSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';

export const backup = functions
  .runWith({
    timeoutSeconds: 540
  })
  .pubsub.schedule('22 13 * * *')
  .timeZone('Europe/Zagreb')
  .onRun(async () => {
    const storage = admin.storage().bucket();
    const fs = admin.firestore();

    const data = [
      {
        collection: 'customers'
      },
      {
        collection: 'gift-cards'
      },
      {
        collection: 'gift-cards-instances'
      },
      {
        collection: 'orders'
      },
      {
        collection: 'reviews'
      },
      {
        collection: 'settings'
      },
      // Language dependant collections
      {
        collection: 'categories-en'
      },
      {
        collection: 'discounts-en'
      },
      {
        collection: 'products-en'
      },
      {
        collection: 'sales-en'
      }
    ];

    const date = new Date();

    for (const d of data) {
      const items = await fs.collection(d.collection).get();

      const fileName = `${d.collection}-${date.getDay()}.json`;
      const fileTemp = join(tmpdir(), fileName);

      writeFileSync(
        fileTemp,
        JSON.stringify(
          items.docs.map(it => ({
            id: it.id,
            ...it.data()
          }))
        )
      );

      try {
        await storage.upload(fileTemp, {
          destination: join('/', 'backups', fileName),
          resumable: false,
          gzip: true
        });

        console.log(`Wrote: ${d.collection}-${date.getDay()}.json`);
      } catch (e) {
        console.error(e);
      }

      unlinkSync(fileTemp);
    }
  });
