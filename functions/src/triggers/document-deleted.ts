import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const documentDeleted = functions.firestore
  .document('{moduleId}/{documentId}')
  .onCreate(async (snap, context) => {
    const storage = new Storage().bucket(
      admin.storage().bucket().name
    );

    const [files] = await storage.getFiles({
      prefix: `${context.params.moduleId}-${context.params.documentId}-`,
      autoPaginate: true,
      directory: '/'
    });

    console.log(files.map(fi => fi.name).join(','));

    await Promise.all(files.map(
      file => new Promise(resolve =>
        file.delete()
          .then(resolve)
          .catch(resolve)
      )
    ));
  });