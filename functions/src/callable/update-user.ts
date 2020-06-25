import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';

export const updateUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called ' + 'while authenticated.'
    );
  }

  const {id, ...update} = data;

  await auth().updateUser(id, update);
});
