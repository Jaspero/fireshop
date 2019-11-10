import * as functions from 'firebase-functions';
import {parseEmail} from '../utils/parse-email';
import * as admin from 'firebase-admin';

export const userDeleted = functions.auth.user().onDelete(async user => {
  await Promise.all([
    new Promise(resolve =>
      admin
        .firestore()
        .collection('customers')
        .doc(user.uid)
        .delete()
        .then(resolve)
        .catch(resolve)
    ),
    parseEmail(user.email as string, 'Sorry to see you go', 'user-deleted-account', user),
    parseEmail(
      // TODO: Admin email
      '',
      'User Account Deleted',
      'admin-user-deleted-account-notification',
      user
    )
  ]);

  return true;
});
