import {FirestoreCollection} from '../enums/firestore-collections.enum';
import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';

/**
 * Updates users custom claims when
 * the users role changes in firestore
 */
export const userDocumentUpdated = functions.firestore
  .document(`${FirestoreCollection.Users}/{documentId}`)
  .onUpdate(async change => {
    const after: any = change.after.data();
    const before: any = change.before.data();

    if (after.role !== before.role) {
      await auth().setCustomUserClaims(
        change.after.id,
        {
          role: after.role
        }
      )
    }
  });

