import * as functions from 'firebase-functions';
import {parseEmail} from '../utils/parse-email';

export const userDeleted = functions.auth.user().onCreate(async user => {
  await parseEmail(user.email, 'Welcome to Fireshop', 'user-deleted', user);

  return true;
});
