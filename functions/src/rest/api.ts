import * as cors from 'cors';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface RequestWithCollection extends express.Request {
  collectionDoc: any;
  ref: admin.firestore.CollectionReference;
}

/**
 * TODO:
 * Connect authorization
 */
function ca(scope: 'write' | 'read') {
  return async (req: any, res: express.Response, next: express.NextFunction) => {

    const firestore = admin
      .firestore();

    let collection: any;

    try {
      collection = await firestore
        .collection('modules')
        .doc(req.params.collection)
        .get()
    } catch (e) {
      return res.status(500).send({error: e.toString()})
    }

    collection = collection.data();

    if (collection[scope] && !collection[scope].length) {
      return res.status(401).send({
        error: 'Missing access scope'
      })
    }

    req.collectionDoc = collection;
    req.ref = firestore.collection(req.params.collection);

    return next();
  }
}

const app = express();

app.use(cors());

// @ts-ignore
app.get('/:collection', ca('read'), (req: RequestWithCollection, res: express.Response) => {
  async function exec() {
    let {
      order,
      direction = 'asc',
      limit,
      query = '[]'
    } = req.query;

    const lookup = req.ref;

    if (order) {
      lookup.orderBy(order, direction);
    }

    if (limit) {
      lookup.limit(parseInt(limit))
    }

    if (query) {
      const items: [string, any] = JSON.parse(query);

      items.forEach(([key, value]) =>
        lookup.where(key, '==', value)
      )
    }

    const response = await lookup.get();

    return response.docs.map(it => ({
      id: it.id,
      ...it.data()
    }));
  }

  exec()
    .then()
    .catch(error =>
      res
        .status(500)
        .send({error: error.toString()})
    )
});

// @ts-ignore
app.get('/:collection/:id', ca('read'), (req: RequestWithCollection, res: express.Response) => {

  async function exec() {
    const {id} = req.params;

    const response = await req.ref.doc(id).get();

    return {
      id: response.id,
      ...response.data()
    }
  }

  exec()
    .then()
    .catch(error =>
      res
        .status(500)
        .send({error: error.toString()})
    )
});

export const api = functions.https.onRequest(app);
