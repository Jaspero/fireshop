import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {STATIC_CONFIG} from '../consts/static-config.const';
import {FirestoreCollection} from '../enums/firestore-collections.enum';

export const userDeleted = functions
  .region(STATIC_CONFIG.cloudRegion)
  .auth
  .user()
  .onDelete(async user => {
    try {
      await firestore()
        .collection(FirestoreCollection.Users)
        .doc(user.uid)
        .delete();
    } catch (e) {}
  });
