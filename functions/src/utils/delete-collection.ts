import {firestore} from 'firebase-admin';

export function deleteCollection(
  db: firestore.Firestore,
  collectionPath: string,
  batchSize: number
) {
  return new Promise((resolve, reject) => {
    deleteQueryBatch(
      db,
      db.collection(collectionPath).limit(batchSize),
      batchSize,
      resolve,
      reject
    );
  });
}

function deleteQueryBatch(
  db: firestore.Firestore,
  query: FirebaseFirestore.Query,
  batchSize: number,
  resolve: Function,
  reject: (reason?: any) => void
) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}
