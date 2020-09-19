import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {deleteCollection} from '../utils/delete-collection';

export const documentDeleted = functions.firestore
  .document('{moduleId}/{documentId}')
  .onDelete(async (snap, context) => {
    const storage = new Storage().bucket(admin.storage().bucket().name);
    const firestore = admin.firestore();
    const {moduleId, documentId} = context.params;

    const [fs, module] = await Promise.all([
      storage.getFiles({
        delimiter: '/',
        autoPaginate: true
      }),
      firestore.doc(`modules/${moduleId}`).get()
    ]);
    const [files] = fs;

    const toExec: Array<Promise<any>> = files
      .filter(file => file.name.startsWith(`${moduleId}-${documentId}-`))
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
      );

    if (module.exists) {
      const moduleData = module.data() as any;

      if (moduleData.metadata && moduleData.metadata.subCollections) {
        moduleData.metadata.subCollections.forEach(
          ({name, batch}: {name: string; batch?: number}) => {
            toExec.push(
              deleteCollection(
                firestore,
                `${moduleId}/${documentId}/${name}`,
                batch || 100
              )
            );
          }
        );
      }
    }

    if (toExec.length) {
      await Promise.all(toExec);
    }
  });
