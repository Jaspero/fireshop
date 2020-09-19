import {compile} from 'json-schema-to-typescript';
import * as functions from 'firebase-functions';

export const jsonSchemaToTypescript = functions.https.onCall(
  async (data, context) => {
    if (!context.auth || !context.auth.token.role) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called ' + 'while authenticated.'
      );
    }

    return await compile(data, data.name, {bannerComment: ''});
  }
);
