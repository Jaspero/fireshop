import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as stripeLib from 'stripe';
import {ENV_CONFIG} from '../consts/env-config.const';
import {HttpStatus} from '../enums/http-status.enum';

const app = express();
const si = stripeLib(ENV_CONFIG.stripe.token);

app.use(cors());

// TODO: Send order
app.post('/checkout', (req, res) => {
  async function exec() {
    const snapshots: any[] = await Promise.all(
      req.body.orderItems.map(item =>
        admin
          .firestore()
          .collection(`products-${req.body.lang}`)
          .doc(item.id)
          .get()
      )
    );

    let amount = 0;

    for (let i = 0; i < snapshots.length; i++) {
      const data = snapshots[i].data();
      amount += req.body.orderItems[i].quantity * data.price;
    }

    const paymentIntent = await si.paymentIntents.create({
      amount,
      currency: 'usd'
    });

    return {clientSecret: paymentIntent.client_secret};
  }

  exec()
    .then(data => res.json(data))
    .catch(error =>
      res.status(HttpStatus.InternalServerError).send({error: error.toString()})
    );
});

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  const body = req.body;

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

  let intent = null;

  switch (event['type']) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      break;

    // TODO: Notify customer of failed payment
    case 'payment_intent.payment_failed':
      intent = event.data.object;
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.error('Failed:', intent.id, message);
      break;
  }

  res.sendStatus(HttpStatus.Ok);
});

export const stripe = functions.https.onRequest(app);
