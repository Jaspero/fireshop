import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  let {category, id, num, lang, relatedProducts} = req.query;

  num = parseFloat(num);

  const collection = admin.firestore().collection(`products-${lang}`);

  relatedProducts = (await Promise.all(
    (relatedProducts || '').split(',').reduce((acc, cur) => {
      if (cur) {
        acc.push(
          collection
            .doc(cur)
            .get()
            .then(
              it =>
                it.exists && {
                  id: it.id,
                  ...it.data()
                }
            )
        );
      }

      return acc;
    }, [])
  )).filter(it => it);

  if (relatedProducts.length >= num) {
    return res.json(relatedProducts);
  }

  num -= relatedProducts.length;

  const categoryData = (await collection
    .where('category', '==', category)
    .get())
    .docs
    .reduce((acc, cur) => {
      const data = {
        id: cur.id,
        ...cur.data()
      };

      if (data.id !== id) {
        acc.push(data);
      }

      return acc;
    }, [] as any[]);

  for (let i = 0; i < num; i++) {
    if (categoryData.length) {
      const number = Math.floor(Math.random() * categoryData.length);
      relatedProducts.push(categoryData[number]);
      categoryData.splice(number, 1);
    }
  }

  return res.json(relatedProducts);
});

export const similarProducts = functions.https.onRequest(app);
