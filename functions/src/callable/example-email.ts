import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {parseEmail} from '../utils/parse-email';

export const exampleEmail = functions.https.onCall(async data => {

  const exampleData = (await admin
    .firestore()
    .doc(`settings/templates/template-data/${data.id}`)
    .get()).data().value;

  await parseEmail(data.email, data.subject, data.template, exampleData);

  return true;
});
