import * as Busboy from 'busboy';
import * as express from 'express';
import * as csv from 'csvtojson';
import * as functions from 'firebase-functions';
import * as ajv from 'ajv';
import * as admin from 'firebase-admin';
import nanoid = require('nanoid');
import {constants} from 'http2';
import {CORS} from '../consts/cors-whitelist.const';
import {safeEval} from '../utils/safe-eval';
import {authenticated} from './middlewares/authenticated';

const app = express();
app.use(CORS);

app.post('/', authenticated, (req, res) => {
  const ajvInstance = new ajv();
  const busboy = new Busboy({headers: req.headers});
  const parsedData: any = {};
  let fileData = '';

  busboy.on('file', (fieldname, file) => {
    file.on('data', data => {
      fileData += data.toString();
    });
  });

  busboy.on('field', (fieldName, val) => {
    if (!parsedData[fieldName]) {
      parsedData[fieldName] = '';
    }

    parsedData[fieldName] += val.toString();
  });

  busboy.on('finish', () => {
    async function exec() {
      const validator = ajvInstance.compile(JSON.parse(parsedData.schema));
      const type = parsedData.type || 'csv';

      let jsonObj: any;

      switch (type) {
        case 'csv':
          jsonObj = await csv({
            delimiter: parsedData.delimiter || 'auto'
          }).fromString(fileData);
          break;
        case 'json':
          jsonObj = JSON.parse(fileData);
          break;
      }

      let rowFunction: any;

      if (parsedData['importModule-rowFunction']) {
        rowFunction = safeEval(parsedData['importModule-rowFunction']);
      }

      const {errors, created} = jsonObj.reduce(
        (acc: any, cur: any, index: number) => {
          validator(cur);

          if (validator.errors) {
            acc.errors.push({index, errors: validator.errors});
          } else {

            let {id, ...saveData} = cur;

            if (!id) {
              id = nanoid();
            }

            if (rowFunction) {
              saveData = rowFunction(saveData);
            }

            acc.created.push(
              admin
                .firestore()
                .collection(parsedData.collection)
                .doc(id)
                .set(saveData)
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

      return {
        created: created.length,
        errors
      };
    }

    exec()
      .then(data => res.json(data))
      .catch(error => {
        console.error(error);
        return res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({error: error.toString()});
      });
  });

  // @ts-ignore
  busboy.end(req['rawBody']);
});

export const importData = functions.https.onRequest(app);
