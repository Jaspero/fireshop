import * as Busboy from 'busboy';
import * as cors from 'cors';
import * as express from 'express';
import * as csv from 'csvtojson';
import * as functions from 'firebase-functions';

const app = express();
app.use(cors());

app.post('/', (req, res) => {
  const busboy = new Busboy({headers: req.headers});

  let fileData = '';

  busboy.on('file', (fieldname, file) => {
    file.on('data', data => {
      fileData += data.toString();
    });
  });

  busboy.on('finish', () => {
    console.log('fileData', fileData);
    csv()
      .fromString(fileData)
      .then(jsonObj => {
        console.log('jsonObj', jsonObj);
        res.json({jsonObj});
      });
  });

  busboy.end(req['rawBody']);
});

export const importData = functions.https.onRequest(app);
