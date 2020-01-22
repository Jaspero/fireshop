import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';

export const removeUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called ' + 'while authenticated.'
    );
  }

  try {
    await auth().deleteUser(data.id);
  } catch (e) {
    throw new functions.https.HttpsError('internal', e.toString());
  }

  return true;
});
