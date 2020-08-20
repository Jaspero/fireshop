import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.role) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called ' + 'while authenticated.'
    );
  }

  let user: admin.auth.UserRecord;

  try {
    user = await admin.auth().createUser(data);
  } catch (e) {
    throw new functions.https.HttpsError('internal', e.toString());
  }

  return {
    id: user.uid,
    providerData: user.providerData
  };
});
