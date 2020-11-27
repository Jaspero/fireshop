import {auth} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';

export const getUser = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.role) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    return auth().getUser(data);
  });
