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
    await Promise.all([
      parseEmail(user.email, 'Welcome to Fireshop', 'new-user-signed-up', user),
      parseEmail(
        user.email,
        'New shop sign-up',
        'admin-sign-up-notification',
        user
      )
    ]);
  }

  return true;
});
