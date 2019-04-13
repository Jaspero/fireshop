import * as functions from 'firebase-functions';

export const orderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate((snap, context) => {
    console.log('snap', snap);
    console.log('context', context);
  });
