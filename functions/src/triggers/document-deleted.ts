import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {COLLECTIONS_METADATA} from '../consts/collections-metadata.const';
import {deleteCollection} from '../utils/delete-collection';

export const documentDeleted = functions.firestore
  .document('{moduleId}/{documentId}')
  .onDelete(async (snap, context) => {
    const storage = new Storage().bucket(admin.storage().bucket().name);
    const firestore = admin.firestore();
    const {
      moduleId,
      documentId
    } = context.params;


    const [files] = await storage.getFiles({
      delimiter: '/',
      autoPaginate: true
    });
    const toExec: Array<Promise<any>> = files
      .filter(file =>
        file.name.startsWith(
          `${moduleId}-${documentId}-`
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
      );

    const module = COLLECTIONS_METADATA.find(it => it.expression.test(moduleId));

    if (module && module.subCollections) {
      module.subCollections.forEach(({name, batch}: {name: string, batch?: number}) => {
        toExec.push(
          deleteCollection(
            firestore,
            `${moduleId}/${documentId}/${name}`,
            batch || 100
          )
        )
      })
    }

    await Promise.all(toExec);
  });
