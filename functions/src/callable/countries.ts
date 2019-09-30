import {getData} from 'country-list';
import * as functions from 'firebase-functions';

export const countries = functions.https.onCall(async () => {
  return getData();
});
