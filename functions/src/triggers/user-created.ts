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

    auth().setCustomUserClaims(user.uid, customClaims)
      .catch(error => {
        console.error('Setting custom claims', error);
      });
  }

  firestore()
    .collection(FirestoreCollection.Users)
    .doc(user.uid)
    .set({
      createdOn: Date.now(),
      email: user.email,

      /**
       * Assign providerData if it's an admin
       * for easier reference
       */
      ...role && {providerData: user.providerData.map((it: any) => it.providerId)}
    })
    .catch(error => {
      console.error('Creating user', error);
    });

  return true;
});
