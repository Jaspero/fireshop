import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';

export const createUser = functions.https.onCall(async data => {
  const user = await auth().createUser(data);
  return {
    id: user.uid,
    providerData: user.providerData
  };
});
