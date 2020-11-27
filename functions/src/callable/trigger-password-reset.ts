import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';
import {STATIC_CONFIG} from '../consts/static-config.const';

export const triggerPasswordReset = functions
  .region(STATIC_CONFIG.cloudRegion)
  .https
  .onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.role) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    let link;

    /**
     * TODO:
     * Send the link via email using your mail provider
     */
    try {
      link = await auth().generatePasswordResetLink(data);
    } catch (e) {
      throw new functions.https.HttpsError('internal', e.toString());
    }

    return {
      link
    };
  });
