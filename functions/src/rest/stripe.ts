import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as stripeLib from 'stripe';
import {ENV_CONFIG} from '../consts/env-config.const';
import {HttpStatus} from '../enums/http-status.enum';
import {parseEmail} from '../utils/parse-email';

interface OrderItem {
  id: string;
  quantity: number;
}

const app = express();
const si = stripeLib(ENV_CONFIG.stripe.token);

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
        lang: req.body.lang
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
  const [order, settings] = await Promise.all([
    admin
      .firestore()
      .collection('orders')
      .where('paymentIntentId', '==', intent.id)
      .get()
      .then(snapshots => {
        const docs = snapshots.docs.map(d => ({
          ...(d.data() as {
            orderItems: OrderItem[];
          }),
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
        ...(snapshot.data() as {
          inactiveForQuantity: boolean;
          autoReduceQuantity: boolean;
          errorNotificationEmail: string;
        })
      }))
  ]);
  const items = await getItems(order.orderItems, intent.metadata.lang);

  console.log('intent', intent);
  console.log('order', order);
  console.log('settings', settings);
  console.log('items', items);

  let exec;

  switch (event['type']) {
    case 'payment_intent.succeeded':
      exec = [
        admin
          .firestore()
          .collection('order')
          .doc(order.id)
          .set(
            {
              status: 'payed'
            },
            {merge: true}
          )
      ];

      if (settings.autoReduceQuantity) {
        exec.push(
          ...items.map((item, itemIndex) => {
            const quantity =
              item.quantity - intent.metadata.orderItems[itemIndex].quantity;

            let active = item.active;

            /**
             * If the quantity drops to 0 and the shop is configured to set
             * items to inactive when that happens, mark the product inactive
             */
            if (item.quantity <= 0 && settings.inactiveForQuantity) {
              active = false;
            }

            return admin
              .firestore()
              .collection(`products-${intent.metadata.lang}`)
              .doc(item.id)
              .set(
                {
                  quantity,
                  active
                },
                {merge: true}
              );
          })
        );
      }

      await Promise.all(items);

      break;

    // TODO: Notify customer of failed payment
    case 'payment_intent.payment_failed':
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.error('Failed:', intent.id, message);

      exec = [
        admin
          .firestore()
          .collection('order')
          .doc(order.id)
          .set(
            {
              status: 'failed',
              error: message
            },
            {merge: true}
          )
      ];

      if (settings.errorNotificationEmail) {
        exec.push(
          parseEmail(
            settings.errorNotificationEmail,
            'Error processing payment',
            'error',
            {message}
          )
        );
      }

      await Promise.all(exec);

      break;
  }

  res.sendStatus(HttpStatus.Ok);
});

export const stripe = functions.https.onRequest(app);
