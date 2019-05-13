import * as Busboy from 'busboy';
import * as cors from 'cors';
import * as express from 'express';
import * as csv from 'csvtojson';
import * as functions from 'firebase-functions';
import * as ajv from 'ajv';
import * as schemas from '../consts/schemas.const';
import * as admin from 'firebase-admin';
import {HttpStatus} from '../enums/http-status.enum';
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
    async function exec() {
      const jsonObj = await csv().fromString(fileData);

      const {errors, created} = jsonObj.reduce(
        (acc, cur) => {
          validator(cur);

          if (validator.errors) {
            const err = validator.errors[0];
            err['object'] = cur;
            errors.push(err);
          } else {
            const {id, ...data} = cur;
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

          return acc;
        },
        {
          errors: [],
          created: []
        }
      );

      if (created.length) {
        await Promise.all(created);
      }
    }

    exec()
      .then(data => res.json(data))
      .catch(error =>
        res
          .status(HttpStatus.InternalServerError)
          .send({error: error.toString()})
      );
  });

  busboy.end(req['rawBody']);
});

export const importData = functions.https.onRequest(app);
