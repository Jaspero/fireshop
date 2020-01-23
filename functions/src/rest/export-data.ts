import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as XLSX from 'xlsx';
import * as express from 'express';
import {Parser} from 'json2csv';
import {constants} from 'http2';
import {CORS} from '../consts/cors-whitelist.const';
import {authenticated} from './middlewares/authenticated';

enum Type {
  csv = 'csv',
  tab = 'tab',
  json = 'json',
  xls = 'xls'
}

const app = express();
app.use(CORS);

app.post('/', CORS, authenticated, (req, res) => {
  async function exec() {
    const {collection, type, ids} = req.body;

    const docs = (await admin
      .firestore()
      .collection(collection)
      .get()).docs.reduce((acc: any[], doc: any) => {
      if (!ids || !ids.includes(doc.id)) {
        acc.push({
          ...doc.data(),
          id: doc.id
        });
      }

      return acc;
    }, []);

    if (!docs.length) {
      throw new Error('No data to export');
    }

    switch (type) {
      case Type.json:
        return {
          data: JSON.stringify(docs),
          type: 'application/json'
        };

      case Type.xls:
        return {
          data: XLSX.utils.json_to_sheet(docs),
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

      case Type.csv:
      case Type.tab:
      default:
        const json2csvParser = new Parser({
          // TODO: We might need to explicitly add fields
          fields: Object.keys(docs[0]),
          delimiter: type === Type.csv ? ',' : '  '
        });

        return {
          data: json2csvParser.parse(docs),
          type: 'text/csv'
        };
    }
  }

  exec()
    .then(({type, data}: any) => {
      res.setHeader('Content-type', type);
      return res.send(data);
    })
    .catch(error => {
      console.error(error);
      res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({error: error.toString()});
    });
});

export const exportData = functions.https.onRequest(app);
