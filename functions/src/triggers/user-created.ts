import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';

export const userCreated = functions.auth.user().onCreate(async user => {
  const documentRef = await firestore()
    .doc('settings/user')
    .get();
  const roles: Array<{role: string; email: string}> =
    (documentRef.data() || {}).roles || [];
  const role = roles.find(ro => ro.email === user.email);

  if (role) {
    const customClaims = {
      role: role.role
    };

    // Set custom user claims on this newly created user.
    await auth().setCustomUserClaims(user.uid, customClaims);
  }

  return true;
});
