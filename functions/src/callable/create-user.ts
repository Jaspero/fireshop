import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';

export const createUser = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.role) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'This function must be called while authenticated.'
      );
    }

    let user: admin.auth.UserRecord;

    try {
      user = await admin.auth().createUser(data);
    } catch (e) {
      console.error(e);
      throw new functions.https.HttpsError('internal', e.message);
    }

    return {
      id: user.uid,
      providerData: user.providerData
    };
  });
