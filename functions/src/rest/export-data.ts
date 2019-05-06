import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as XLSX from 'xlsx';
import * as express from 'express';
import * as cors from 'cors';
import {Parser} from 'json2csv';
import {HttpStatus} from '../enums/http-status.enum';

enum Type {
  csv = 'csv',
  tab = 'tab',
  json = 'json',
  xls = 'xls'
}

const app = express();
app.use(cors());

app.post('/', (req, res) => {
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

    if (!docs.length) {
      throw new Error('No data to export');
    }

    switch (type) {
      case Type.csv:
      case Type.tab:
        const json2csvParser = new Parser({
          // TODO: We might need to explicitly add fields
          fields: Object.keys(docs[0]),
          delimiter: type === Type.csv ? ',' : '  '
        });

        return {
          data: json2csvParser.parse(docs),
          type: 'text/csv'
        };

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
    }
  }

  exec()
    .then(({type, data}) => {
      res.setHeader('Content-type', type);
      return res.send(data);
    })
    .catch(error => {
      console.error(error);
      res
        .status(HttpStatus.InternalServerError)
        .send({error: error.toString()});
    });
});

export const exportData = functions.https.onRequest(app);
