import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  const {category, id, num, lang} = req.query;

  admin
    .firestore()
    .collection(`products-${lang}`)
    .where('category', '==', category)
    .get()
    .then(snapshots => {
      const docs = snapshots.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      const index = docs.findIndex(it => it.id === id);

      if (index !== -1) {
        docs.splice(index, 1);
      }

      const finalArr = [];

      for (let i = 0; i < parseFloat(num); i++) {
        if (docs.length) {
          const number = Math.floor(Math.random() * docs.length);
          finalArr.push(docs[number]);
          docs.splice(number, 1);
        }
      }

      return res.json(finalArr);
    });
});

export const similarProducts = functions.https.onRequest(app);
