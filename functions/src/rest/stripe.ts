import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
const app = express();

app.use(cors());

// TODO: Send order
app.post('/checkout', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 200,
    currency: 'usd'
  });

  return res.json({
    clientSecret: paymentIntent.client_secret
  });
});

export const stripe = functions.https.onRequest(app);
