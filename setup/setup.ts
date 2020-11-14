import * as admin from 'firebase-admin';
import {COLLECTIONS} from './collections/collections';
import {MODULES} from './modules/modules';

const serviceAccount = require('./serviceAccountKey.json');

/**
 * Add your firebase config
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://jaspero-jms.firebaseio.com'
});

async function exec() {
  const fStore = admin.firestore();

  for (const collection of COLLECTIONS) {
    for (const document of collection.documents) {

      const {id, ...data} = document;

      await fStore.collection(collection.name).doc(id).set(data);
    }
  }

  for (const module of MODULES) {

    const {id, ...data} = module;

    await fStore.collection('modules').doc(id).set({
      ...data,
      createdOn: Date.now()
    });
  }
}

exec()
  .then(() => {
    console.log('Setup completely successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


