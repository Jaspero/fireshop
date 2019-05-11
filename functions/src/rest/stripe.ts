import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as stripeLib from 'stripe';
import {ENV_CONFIG} from '../consts/env-config.const';
import {HttpStatus} from '../enums/http-status.enum';
import {parseEmail} from '../utils/parse-email';

class CheckoutError extends Error {
  constructor(
    public data: Array<{
      data: any;
      message: string;
      type: string;
    }>
  ) {
    super('not important');
    Object.setPrototypeOf(this, CheckoutError.prototype);
  }
}

interface OrderItem {
  id: string;
  quantity: number;
}

const app = express();
const si = stripeLib(ENV_CONFIG.stripe.token);

app.use(cors());

async function getItems(orderItems: OrderItem[], lang: string) {
  const snapshots: any[] = await Promise.all(
    orderItems.map(item => {
      const doc = admin
        .firestore()
        .collection(`products-${lang}`)
        .doc(item.id);

      return doc.get();
    })
  );
  const error = [];
  for (let i = 0; i < snapshots.length; i++) {
    if (snapshots[i].exists) {
      snapshots[i] = {
        id: snapshots[i].id,
        ...snapshots[i].data()
      };
      if (snapshots[i].quantity < orderItems[i].quantity) {
        error.push({
          message: `We currently don't have enough of ${
            snapshots[i].name
          } in inventory`,
          data: {
            id: snapshots[i].id,
            quantity: snapshots[i].quantity,
            name: snapshots[i].name
          },
          type: 'quantity_insufficient'
        });
      }
    } else {
      error.push({
        message: `item ${snapshots[i].name} is currently unavailable`,
        data: {
          id: snapshots[i].id,
          quantity: snapshots[i].quantity,
          name: snapshots[i].name
        },
        type: 'product_missing'
      });
    }
  }

  if (error.length) {
    throw new CheckoutError(error);
  }

  return snapshots;
}

app.post('/checkout', (req, res) => {
  async function exec() {
    let [currency, description, items, stripeCustomer]: any = await Promise.all(
      [
        admin
          .firestore()
          .collection('settings')
          .doc('currency')
          .get(),
        admin
          .firestore()
          .collection('settings')
          .doc('general-settings')
          .get(),
        getItems(req.body.orderItems, req.body.lang),

        /**
         * Try to retrieve a customer if the
         * checkout is from a logged in user
         */
        ...(req.body.customer
          ? [
              si.customers.list({
                email: req.body.customer.email,
                limit: 1
              })
            ]
          : [])
      ]
    );

    console.log(1, stripeCustomer);

    /**
     * Create the customer if it doesn't exist
     */
    if (stripeCustomer) {
      if (stripeCustomer.data.length) {
        stripeCustomer = stripeCustomer.data[0];
      } else {
        stripeCustomer = await si.customers.create({
          email: req.body.customer.email,
          name: req.body.customer.name,
          metadata: {
            id: req.body.customer.id
          }
        });
      }
    }

    console.log(2, stripeCustomer);

    currency = currency.data();
    description = description.data();

    const amount = items.reduce(
      (acc, cur, curIndex) =>
        req.body.orderItems[curIndex].quantity * cur.price,
      currency.shippingCost || 0
    );

    const paymentIntent = await si.paymentIntents.create({
      amount,
      currency: currency.primary,
      metadata: {
        lang: req.body.lang
      },
      description: description.description,
      statement_descriptor: description.statementDescription,

      /**
       * Attach customer if it was created
       */
      ...(stripeCustomer
        ? {
            customer: stripeCustomer.id
          }
        : {})
    });

    return {clientSecret: paymentIntent.client_secret};
  }

  exec()
    .then(data => res.json(data))
    .catch(error => {
      if (error instanceof CheckoutError) {
        res.status(HttpStatus.BadRequest).send(error.data);
      } else {
        res
          .status(HttpStatus.InternalServerError)
          .send({error: error.toString()});
      }
    });
});

app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event = null;

  try {
    event = si.webhooks.constructEvent(
      req['rawBody'],
      sig,
      ENV_CONFIG.stripe.webhook
    );
  } catch (err) {
    console.error(err);
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
            email: string;
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

  let exec;

  switch (event['type']) {
    case 'payment_intent.succeeded':
      exec = [
        admin
          .firestore()
          .collection('orders')
          .doc(order.id)
          .set(
            {
              status: 'payed'
            },
            {merge: true}
          ),
        parseEmail(order.email, 'Order Complete', 'order-complete', {
          order,
          items
        })
      ];

      if (settings.autoReduceQuantity) {
        exec.push(
          ...items.map((item, itemIndex) => {
            const quantity =
              item.quantity - order.orderItems[itemIndex].quantity;

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

    case 'payment_intent.payment_failed':
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.error('Failed:', intent.id, message);

      exec = [
        admin
          .firestore()
          .collection('orders')
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
            'admin-error.hbs',
            {
              title: 'Checkout Error',
              description: 'There was an error during checkout',
              additionalProperties: [{key: 'OrderId', value: order.id}],
              message,
              firebaseDashboard:
                'https://console.firebase.google.com/u/2/project/jaspero-site/overview',
              adminDashboard: 'https://fireshop.admin.jaspero.co/'
            }
          ),

          parseEmail(
            order.email,
            'Error processing order',
            'customer-error.hbs',
            {
              website: 'https://fireshop.jaspero.co'
            }
          )
        );
      }

      await Promise.all(exec);

      break;
  }

  res.sendStatus(HttpStatus.Ok);
});

export const stripe = functions.https.onRequest(app);
