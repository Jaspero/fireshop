import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as stripeLib from 'stripe';
import {ENV_CONFIG} from '../consts/env-config.const';
import {HttpStatus} from '../enums/http-status.enum';

interface OrderItem {
  id: string;
  quantity: number;
}

const app = express();
const si = stripeLib('sk_test_FJbKQgGuN4wRNFZkQLAKV1fn');

app.use(cors());

async function getItems(orderItems: OrderItem[], lang: string) {
  const snapshots: any[] = await Promise.all(
    orderItems.map(item =>
      admin
        .firestore()
        .collection(`products-${lang}`)
        .doc(item.id)
        .get()
    )
  );

  for (let i = 0; i < snapshots.length; i++) {
    snapshots[i] = {
      id: snapshots[i].id,
      ...snapshots[i].data()
    };
  }

  return snapshots;
}

app.post('/checkout', (req, res) => {
  async function exec() {
    const items = await getItems(req.body.orderItems, req.body.lang);
    const amount = items.reduce(
      (acc, cur, curIndex) =>
        req.body.orderItems[curIndex].quantity * cur.price,
      0
    );

    const paymentIntent = await si.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        lang: req.body.lang,
        orderItems: req.body.orderItems
      }
    });

    return {clientSecret: paymentIntent.client_secret};
  }

  exec()
    .then(data => res.json(data))
    .catch(error =>
      res.status(HttpStatus.InternalServerError).send({error: error.toString()})
    );
});

app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event = null;

  try {
    event = si.webhooks.constructEvent(
      req.body,
      sig,
      ENV_CONFIG.stripe.webhook
    );
  } catch (err) {
    // invalid signature
    res.status(HttpStatus.BadRequest).end();
    return;
  }

  const intent = event.data.object;
  const [order, settings, items] = await Promise.all([
    admin
      .firestore()
      .collection('orders')
      .where('paymentIntentId', '==', intent.id)
      .get()
      .then(snapshots => {
        const docs = snapshots.docs.map(d => ({
          ...d.data(),
          id: d.id
        }));

        return docs[0];
      }),

    admin
      .firestore()
      .collection('settings')
      .doc('general-settings')
      .get()
      .then(snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      })),

    await getItems(intent.metadata.orderItems, intent.metadata.lang)
  ]);

  console.log('intent', intent);
  console.log('order', order);
  console.log('settings', settings);
  console.log('items', items);

  switch (event['type']) {
    case 'payment_intent.succeeded':
      break;

    // TODO: Notify customer of failed payment
    case 'payment_intent.payment_failed':
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.error('Failed:', intent.id, message);
      break;
  }

  res.sendStatus(HttpStatus.Ok);
});

export const stripe = functions.https.onRequest(app);
