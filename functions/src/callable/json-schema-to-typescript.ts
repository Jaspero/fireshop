import {compile} from 'json-schema-to-typescript';
import * as functions from 'firebase-functions';

export const jsonSchemaToTypescript = functions.https.onCall(async data => {
  return await compile(data, 'dummy', {bannerComment: ''})
});
