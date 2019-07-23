import * as compression from 'compression';
import * as domino from 'domino';
import * as express from 'express';
import * as cors from 'cors';
import * as functions from 'firebase-functions';
import {readFileSync} from 'fs';
import {constants} from 'http2';
import {DEFAULT_META, PAGE_PREFIX, PAGE_SUFFIX, PAGES} from './consts/pages.const';

const DIST_FOLDER = './index.html';
const index = readFileSync(DIST_FOLDER).toString();

const app = express();
app.use(compression());
app.use(cors({origin: true}));

app.get('*', async (req, res) => {

  const document = domino.createDocument(index, true);

  res.setHeader('Content-Type', 'text/html');

  let status = constants.HTTP_STATUS_OK;
  let foundPage;
  let capture;

  for (const page of PAGES) {
    const matcher = new RegExp(page.match);
    const match = req.url.match(matcher);

    if (match) {
      foundPage = page;
      capture = match;
      break;
    }
  }

  if (!foundPage) {
    status = constants.HTTP_STATUS_NOT_FOUND;
  }

  if (foundPage.operation) {
    try {
      await foundPage.operation(capture, document);
    } catch (e) {
      console.log('e', e);
      // TODO: Redirect to 404
    }
  } else {
    document.title = PAGE_PREFIX + foundPage.name + PAGE_SUFFIX;
    Object.entries(foundPage.meta || DEFAULT_META).forEach(([key, value]) => {
      document.querySelector(`meta[name=${key}]`)['content'] = value;
    });
  }

  return res
    .status(status)
    .send(document.documentElement.innerHTML);
});

export const ssr = functions.https.onRequest(app);
