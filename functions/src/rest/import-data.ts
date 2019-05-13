import * as Busboy from 'busboy';
import * as cors from 'cors';
import * as express from 'express';
import * as csv from 'csvtojson';
import * as functions from 'firebase-functions';
import * as ajv from 'ajv';
import * as schemas from '../consts/schemas.const';
import * as admin from 'firebase-admin';
import nanoid = require('nanoid');

const app = express();
app.use(cors());

app.post('/', (req, res) => {
  let collection = req.query.collection;
  if (collection.includes('-')) {
    collection = collection.substring(0, collection.length - 3);
  }
  const schema = schemas[collection];
  const ajvInstance = new ajv();
  const validator = ajvInstance.compile(schema);

  const busboy = new Busboy({headers: req.headers});

  let fileData = '';

  busboy.on('file', (fieldname, file) => {
    file.on('data', data => {
      fileData += data.toString();
    });
  });

  busboy.on('finish', () => {
    csv()
      .fromString(fileData)
      .then(jsonObj => {
        const errors = [];
        const created = [];

        jsonObj.forEach(obj => {
          validator(obj);
          if (validator.errors) {
            const err = validator.errors[0];
            err['object'] = obj;
            errors.push(err);
          } else {
            const {id, ...data} = obj;
            created.push(
              admin
                .firestore()
                .collection(req.query.collection)
                .doc(id || nanoid())
                .set({
                  ...data,
                  ...{createdOn: Date.now()}
                })
            );
          }
        });
        if (created.length) {
          let result;
          Promise.all(created)
            .then(res => {
              console.log('res', res);
              result = res;
            })
            .catch(err => {
              console.log('error', err);
            })
            .finally(() => {
              res.json({errors, success: created.length});
            });
        } else {
          res.json({errors});
        }
      });
  });

  busboy.end(req['rawBody']);
});

export const importData = functions.https.onRequest(app);
