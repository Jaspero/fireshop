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

app.post('/:module', authenticated(), (req, res) => {
  async function exec() {

    let moduleDoc: any = (await admin.firestore().collection('modules').doc(req.params.module).get());

    if (!moduleDoc.exists) {
      throw new Error('Requested module not found.')
    }

    moduleDoc = moduleDoc.data();

    if (
      moduleDoc.authorization &&
      moduleDoc.authorization.write &&
      // @ts-ignore
      !moduleDoc.authorization.write.includes(req['user'].role)
    ) {
      throw new Error('User does not have permission to export this module')
    }

    const {collection, type, ids, filters, sort} = req.body;

    let col: any = admin
      .firestore()
      .collection(collection);

    if (!ids) {
      if (filters && filters.length) {
        for (const item of filters) {
          if (
            item.value !== undefined &&
            item.value !== null &&
            item.value !== '' &&
            (
              (
                item.operator === 'array-contains' ||
                item.operator === 'array-contains-any' ||
                item.operator === 'in'
              ) && Array.isArray(item.value) ?
                item.value.length : true
            )
          ) {
            col = col.where(item.key, item.operator, item.value);
          }
        }
      }

      if (sort) {
        col = col.orderBy(
          sort.active,
          sort.direction
        )
      }
    }

    const docs = (await col.get()).docs.reduce((acc: any[], doc: any) => {
        if (!ids || ids.includes(doc.id)) {
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
