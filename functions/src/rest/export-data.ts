import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {HttpStatus} from '../enums/http-status.enum';

export const exportData = functions.https.onRequest((req, res) => {
  async function exec() {
    const {collection, type, ids} = req.body;

    const docs = (await admin
      .firestore()
      .collection(collection)
      .get()).docs.reduce((acc, doc) => {
      if (!ids || !ids.includes(doc.id)) {
        acc.push({
          ...doc.data(),
          id: doc.id
        });
      }

      return acc;
    }, []);
  }

  exec()
    .then(({type, data}) => {
      res.setHeader('Content-type', `application/${type}`);
      return res.send(data);
    })
    .catch(error => {
      console.error(error);
      res
        .status(HttpStatus.InternalServerError)
        .send({error: error.toString()});
    });
});
