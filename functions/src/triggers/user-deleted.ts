import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {FirestoreCollection} from '../enums/firestore-collections.enum';

export const userDeleted = functions.auth.user().onDelete(async user => {
  try {
    await firestore()
      .collection(FirestoreCollection.Users)
      .doc(user.uid)
      .delete();
  } catch (e) {}
});
