import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {parseEmail} from '../utils/parse-email';

export const userCreated = functions.auth.user().onCreate(async user => {
  const documentRef = await firestore()
    .doc('settings/allowed-admins')
    .get();
  const emails = (documentRef.data() || {}).emails || [];

  if (emails.includes(user.email)) {
    const customClaims = {
      admin: true
    };

    // Set custom user claims on this newly created user.
    await auth().setCustomUserClaims(user.uid, customClaims);
  } else {
    await parseEmail(user.email, 'Welcome to Fireshop', 'user-created', user);
  }

  return true;
});
