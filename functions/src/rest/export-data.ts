import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {constants} from 'http2';
import {get, has} from 'json-pointer';
import {Parser} from 'json2csv';
import * as XLSX from 'xlsx';
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


    const {module} = req.params;
    // @ts-ignore
    const role = req['user'].role;

    let moduleDoc: any = await admin.firestore()
      .collection('modules')
      .doc(module)
      .get();

    if (!moduleDoc.exists) {
      throw new Error('Requested module not found.')
    }

    moduleDoc = moduleDoc.data();

    if (
      moduleDoc.authorization &&
      moduleDoc.authorization.read &&
      // @ts-ignore
      !moduleDoc.authorization.read.includes(role)
    ) {
      throw new Error('User does not have permission to export this module')
    }

    const {
      type,
      ids,
      filters,
      sort,
      skip,
      limit,
      columns
    } = req.body;

    let col: any = admin
      .firestore()
      .collection(module);

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

    if (skip) {
      col = col.offset(skip);
    }

    if (limit) {
      col = col.limit(limit);
    }

    let docs = (await col.get()).docs.reduce((acc: any[], doc: any) => {
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

    let baseColumns: any[];

    if (moduleDoc.layout?.table?.tableColumns) {

      /**
       * Filter authorized columns
       */
      baseColumns = moduleDoc.layout.table.tableColumns.filter((column: any) =>
        column.authorization ? column.authorization.includes(role) : true
      );
    } else {
      baseColumns = Object.keys(moduleDoc.schema.properties || {}).map(key => ({
        key: '/' + key,
        label: key
      }));
    }

    const appliedColumns: any[] = columns ? columns.reduce((acc: any[], cur: any) => {
      const ref = baseColumns.find(it => it.key === cur.key);

      if (!cur.disabled && ref && (!ref.authorization || ref.authorization.includes(role))) {
        acc.push({
          ...ref,
          label: cur.label
        })
      }

      return acc;
    }, []) : baseColumns;

    const getValue = (key: string, doc: any) => {
      if (has(doc, key)) {
        return get(doc, key);
      } else {
        return '';
      }
    };

    docs = docs.map((doc: any) =>
      appliedColumns.reduce((acc, cur) => {

        if (Array.isArray(cur.key)) {
          acc[cur.label] = cur.key
            .map((key: string) => getValue(key, doc))
            .join(cur.hasOwnProperty('join') ? cur.join : ', ')
        } else {
          acc[cur.label] = getValue(cur.key, doc);
        }

        return acc;
      }, [])
    );

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
          fields: appliedColumns.map(({label}) => label),
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
