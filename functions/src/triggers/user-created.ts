import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {parseEmail} from '../utils/parse-email';

export const userCreated = functions.auth.user().onCreate(async user => {
  const documentRef = await firestore()
    .doc('settings/user')
    .get();
  const roles = (documentRef.data() || {}).roles || [];
  const role = roles.find(ro => ro.email === user.email);

  if (role) {
    const customClaims = {
      role: role.role
    };

    // Set custom user claims on this newly created user.
    await auth().setCustomUserClaims(user.uid, customClaims);
  } else {
    await parseEmail(user.email, 'Welcome to Fireshop', 'user-created', user);
  }

  return true;
});
