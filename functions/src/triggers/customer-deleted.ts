import * as functions from 'firebase-functions';
import {auth} from 'firebase-admin';

export const customerDeleted = functions.firestore
  .document('customers/{id}')
  .onDelete(async customer => {
    await auth().deleteUser(customer.id);
    return true;
  });
