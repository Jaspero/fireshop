import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const documentDeleted = functions.firestore
  .document('{moduleId}/{documentId}')
  .onDelete(async (snap, context) => {
    const storage = new Storage().bucket(admin.storage().bucket().name);

    const [files] = await storage.getFiles({
      delimiter: '/',
      autoPaginate: true
    });

    await Promise.all(
      files
        .filter(file =>
          file.name.startsWith(
            `${context.params.moduleId}-${context.params.documentId}-`
          )
        )
        .map(
          file =>
            new Promise(resolve =>
              file
                .delete()
                .then(resolve)
                .catch(error => {
                  console.error(error);
                  resolve();
                })
            )
        )
    );
  });
