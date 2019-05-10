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
        let errors = [];
        let created = [];

        jsonObj.forEach(obj => {
          validator(obj);
          if (validator.errors) {
            const err = validator.errors[0];
            err['object'] = obj;
            errors.push(err);
          } else {
            let {id, ...data} = obj;
            data = {...data, ...{createdOn: Date.now()}};
            const objToUpload = admin
              .firestore()
              .collection(req.query.collection)
              .doc(id || nanoid())
              .set(data);
            created.push(objToUpload);
          }
        });

        if (created.length) {
          Promise.all(created)
            .then(res => {
              console.log('result', res);
            })
            .catch(err => {
              console.log('error', err);
            });
        }

        res.json({errors, success: created.length});
      });
  });

  busboy.end(req['rawBody']);
});

export const importData = functions.https.onRequest(app);
