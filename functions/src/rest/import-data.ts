import * as Busboy from 'busboy';
import * as cors from 'cors';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as csv from 'csvtojson';

const app = express();
app.use(cors());

app.post('/', (req, res) => {
  const busboy = new Busboy({headers: req.headers});
  console.log('busboy', busboy);

  res.json({response: busboy});
});

export const importData = functions.https.onRequest(app);
