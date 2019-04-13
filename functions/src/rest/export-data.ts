import * as functions from 'firebase-functions';

export const exportData = functions.https.onRequest((req, res) => {
  res.json({});
});
