import {auth, firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FirestoreCollection} from '../enums/firestore-collections.enum';

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

    await Promise.all([
      auth().setCustomUserClaims(user.uid, customClaims),
      firestore()
        .collection(FirestoreCollection.Admins)
        .doc(user.uid)
        .set({
          createdOn: Date.now(),
          email: user.email,
          providerData: user.providerData.map((it: any) => it.providerId)
        })
    ]);
  }

  return true;
});
