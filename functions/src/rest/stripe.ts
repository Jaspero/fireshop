import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as stripeLib from 'stripe';
import * as admin from 'firebase-admin';
import {ENV_CONFIG} from '../consts/env-config.const';

const app = express();
const si = stripeLib('sk_test_FJbKQgGuN4wRNFZkQLAKV1fn');
// const si = stripeLib(ENV_CONFIG.stripe.token);

app.use(cors());

// TODO: Send order
app.post('/checkout', async (req, res) => {
  // const array = req.body.map(val =>
  //   admin
  //     .firestore()
  //     .collection('products-en')
  //     .doc(val.id)
  // );
  // console.log('array', array);

  //   .then(snapshots => {
  //     console.log('snapshots', snapshots);
  //   })
  //   .catch(res => {
  //     console.log('111111', res);
  //   });

  Promise.all(
    req.body.orderedItems.map(item =>
      admin
        .firestore()
        .collection('products-en')
        .doc(item.id)
        .get()
    )
  )
    .then(snapshots => {
      snapshots.forEach(data => {
        console.log('data', data);
      });
    })
    .catch(res => {
      console.log('res', res);
    });

  const paymentIntent = await si.paymentIntents.create({
    amount: 1099,
    currency: 'usd'
  });

  return res.json({clientSecret: paymentIntent.client_secret});
});

export const stripe = functions.https.onRequest(app);
