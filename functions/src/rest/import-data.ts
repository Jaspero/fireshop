import * as Busboy from 'busboy';
import * as cors from 'cors';
import * as express from 'express';
import * as csv from 'csvtojson';
import * as functions from 'firebase-functions';
import * as ajv from 'ajv';
import * as schemas from '../consts/schemas.const';
import * as admin from 'firebase-admin';

const app = express();
app.use(cors());

app.post('/', (req, res) => {
  const schema = schemas[req.query.collection];
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
            errors.push(validator.errors[0]);
          } else {
            console.log('obj', obj);

            admin
              .firestore()
              .collection(req.query.collection)
              .set(obj)
              .then(snapshots => {
                console.log('snapshots', snapshots);
              })
              .catch(err => {
                console.log('err', err);
              });
          }
        });
        res.json({errors});
      });
  });

  busboy.end(req['rawBody']);
});

export const importData = functions.https.onRequest(app);
