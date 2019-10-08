import * as currencyData from 'currency-codes/data';
import * as functions from 'firebase-functions';

export const currencies = functions.https.onCall(async () => {
  return currencyData.map(({code, currency}) => ({code, name: currency}));
});
