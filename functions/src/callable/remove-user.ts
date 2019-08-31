import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';

export const removeUser = functions.https.onCall(async data => {
  await auth().deleteUser(data.id);
  return true;
});
