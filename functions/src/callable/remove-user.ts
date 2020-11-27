import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';
import {STATIC_CONFIG} from '../consts/static-config.const';

export const removeUser = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.role) {
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
