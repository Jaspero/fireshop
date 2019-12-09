import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as stripeLib from 'stripe';
import {ENV_CONFIG} from '../consts/env-config.const';
import {HttpStatus} from '../enums/http-status.enum';
import {currencyFormat} from '../utils/currency-format';
import {parseEmail} from '../utils/parse-email';

interface OrderItem {
  id: string;
  quantity: number;
  identifier: string;
  price?: number | string;
  attributes: any;
}

interface GeneralSettings {
  allowOutOfQuantityPurchase: boolean;
  inactiveForQuantity: boolean;
  autoReduceQuantity: boolean;
  errorNotificationEmail: string;
}

interface Currency {
  primary: string;
  shipping: number;
}

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

const app = express();
const si = stripeLib(ENV_CONFIG.stripe.token);

app.use(cors());

function getLookUp(orderItem: OrderItem) {
  return orderItem.identifier.replace(orderItem.id + '_', '');
}

async function getItems(
  orderItems: OrderItem[],
  lang: string,
  generalSettings: GeneralSettings
) {
  const snapshots: any[] = await Promise.all(
    orderItems.map(item => {
      const doc = admin
        .firestore()
        .collection(`products-${lang}`)
        .doc(item.id);

      return doc.get();
    })
  );

  const error: any[] = [];

  for (let i = 0; i < snapshots.length; i++) {
    if (snapshots[i].exists) {
      snapshots[i] = {
        id: snapshots[i].id,
        ...snapshots[i].data()
      };

      let lookUp = orderItems[i].id;

      /**
       * If the identifier is different from id than this is
       * a product with attributes
       */
      if (orderItems[i].identifier !== orderItems[i].id) {
        lookUp = getLookUp(orderItems[i]);

        /**
         * Product with these attributes doesn't exist
         */
        if (!snapshots[i].inventory[lookUp]) {
          error.push({
            message: `${snapshots[i].name} with these attributes no longer exists`,
            type: 'product_missing',
            data: {
              id: snapshots[i].id,
              quantity: snapshots[i].quantity,
              name: snapshots[i].name,
              identifier: orderItems[i].identifier
            }
          });
          break;
        }

        snapshots[i].quantity = snapshots[i].inventory[lookUp].quantity;
        snapshots[i].price = snapshots[i].inventory[lookUp].price;
      }
      /**
       * Product exists but quantity isn't sufficient
       */
      if (
        !generalSettings.allowOutOfQuantityPurchase &&
        snapshots[i].quantity < orderItems[i].quantity
      ) {
        error.push({
          message: `We currently don't have enough of ${snapshots[i].name} in inventory`,
          data: {
            id: snapshots[i].id,
            quantity: snapshots[i].quantity,
            name: snapshots[i].name,
            identifier: orderItems[i].identifier
          },
          type: 'quantity_insufficient'
        });
      }
    } else {
      /**
       * Product doesn't exist
       */
      error.push({
        message: `item ${snapshots[i].name} is currently unavailable`,
        data: {
          id: snapshots[i].id,
          quantity: snapshots[i].quantity,
          name: snapshots[i].name,
          identifier: orderItems[i].identifier
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
    let [
      currency,
      shipping,
      generalSettings,
      stripeCustomer
    ]: any = await Promise.all([
      ...['currency', 'shipping', 'general-settings'].map(key =>
        admin
          .firestore()
          .collection('settings')
          .doc(key)
          .get()
      ),

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
    ]);

    currency = currency.data();
    generalSettings = generalSettings.data();

    const shippingData = shipping.exists ? shipping.data() : {};
    const country = req.body.form.shippingInfo
      ? req.body.form.billing.country
      : req.body.form.shipping.country;

    const items = await getItems(
      req.body.orderItems,
      req.body.lang,
      generalSettings
    );

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

    const amount = items.reduce(
      (acc, cur, curIndex) =>
        acc +
        req.body.orderItems[curIndex].quantity * cur.price[req.body.currency],
      shippingData.hasOwnProperty(country)
        ? shippingData[country].value
        : currency.shippingCost || 0
    );

    const paymentIntent = await si.paymentIntents.create({
      amount,
      currency: req.body.currency,
      metadata: {
        lang: req.body.lang
      },
      description: generalSettings.description,
      statement_descriptor: generalSettings.statementDescription,

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

  let event: any = null;

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
  const [order, settings, currency] = await Promise.all([
    admin
      .firestore()
      .collection('orders')
      .where('paymentIntentId', '==', intent.id)
      .get()
      .then(snapshots => {
        const docs = snapshots.docs.map(d => ({
          ...(d.data() as {
            orderItems: string[];
            orderItemsData: OrderItem[];
            status: string;
            billing?: any;
            price?: any;
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
        ...(snapshot.data() as GeneralSettings)
      })),

    admin
      .firestore()
      .collection('settings')
      .doc('currency')
      .get()
      .then(snapshot => ({
        id: snapshot.id,
        ...(snapshot.data() as Currency)
      }))
  ]);

  if (!order) {
    res.sendStatus(HttpStatus.Ok);
    return;
  }

  /**
   * Join orderItems[] and orderItemsData[]
   */
  const items = await getItems(
    order.orderItems.map((id, index) => {
      return {
        id,
        ...order.orderItemsData[index]
      };
    }),
    intent.metadata.lang,
    settings
  );

  let exec;

  switch (event['type']) {
    case 'payment_intent.succeeded':
      if (order.status === 'payed') {
        res.sendStatus(HttpStatus.Ok);
        return;
      }

      const emailData = {
        order: {
          ...order,
          orderItemsData: order.orderItemsData.map(item => {
            item.price = currencyFormat(order.price.total, currency.primary);
            return item;
          }),
          total: currencyFormat(order.price.total, currency.primary)
        }
      };

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
        parseEmail(
          settings.errorNotificationEmail,
          'Order Complete',
          'admin-order-notification',
          {
            order,
            items
          }
        )
      ];

      if (order.billing.email) {
        exec.push(
          parseEmail(
            order.billing.email,
            'Order Complete',
            'order-complete',
            emailData
          )
        );
      }

      if (settings.autoReduceQuantity) {
        exec.push(
          ...items.map((item, itemIndex) => {
            const current = order.orderItemsData[itemIndex];
            const toUpdate: any = {};

            /**
             * Product has attributes
             */
            if (current.id !== current.identifier) {
              const lookUp = getLookUp(current);
              const inventory = item.inventory[lookUp];

              if (inventory) {
                inventory.quantity -= current.quantity;

                toUpdate.inventory = {
                  [lookUp]: {
                    quantity: inventory.quantity
                  }
                };
              }

              let hasQuantity = false;

              /**
               * If the shop is configured to set items to inactive
               * when out of quantity, loop over the inventory and check
               * if we should deactive the product
               */
              if (settings.inactiveForQuantity && item.inventory) {
                for (const key in item.inventory) {
                  if (item.inventory[key].quantity) {
                    hasQuantity = true;
                    break;
                  }
                }

                if (!hasQuantity) {
                  toUpdate.active = false;
                }
              }
            } else {
              toUpdate.quantity =
                item.quantity - order.orderItemsData[itemIndex].quantity;

              /**
               * If the quantity drops to 0 and the shop is configured to set
               * items to inactive when that happens, mark the product inactive
               */
              if (item.quantity <= 0 && settings.inactiveForQuantity) {
                toUpdate.active = false;
              }
            }

            return admin
              .firestore()
              .collection(`products-${intent.metadata.lang}`)
              .doc(item.id)
              .set(toUpdate, {merge: true});
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
            'admin-checkout-failed-notification',
            {
              message,
              stripeOrderId: order.id,
              firebaseDashboard:
                'https://console.firebase.google.com/u/2/project/jaspero-site/overview',
              adminDashboard: 'https://fireshop.admin.jaspero.co/'
            }
          )
        );

        if (order.billing.email) {
          exec.push(
            parseEmail(
              order.billing.email,
              'Error processing payment',
              'checkout-error',
              {
                website: 'https://fireshop.jaspero.co'
              }
            )
          );
        }
      }

      await Promise.all(exec);

      break;
  }

  res.sendStatus(HttpStatus.Ok);
});

export const stripe = functions.https.onRequest(app);
