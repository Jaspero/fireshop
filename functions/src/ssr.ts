import * as compression from 'compression';
import * as cors from 'cors';
import * as domino from 'domino';
import * as express from 'express';
import * as functions from 'firebase-functions';
import {readFileSync} from 'fs';
import {constants} from 'http2';
import {join} from 'path';
import {
  DEFAULT_META,
  DEFAULT_META_PROPERTIES,
  PAGE_PREFIX,
  PAGE_SUFFIX,
  PAGES
} from './consts/pages.const';

const index = readFileSync(
  join(__dirname, '../dist/public/shop/index.html')
).toString();

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

  if (foundPage) {
    if (foundPage.operation) {
      try {
        await foundPage.operation(capture, document);
      } catch (e) {
        console.log('e', e);
        status = constants.HTTP_STATUS_NOT_FOUND;
      }
    } else {
      document.title = PAGE_PREFIX + foundPage.name + PAGE_SUFFIX;
      Object.entries({
        ...DEFAULT_META,
        ...(foundPage.meta || {})
      }).forEach(([key, value]) => {
        document.querySelector(`meta[name=${key}]`)['content'] = value;
      });

      Object.entries({
        ...DEFAULT_META_PROPERTIES,
        ...(foundPage.metaProperties || {})
      }).forEach(([key, value]) => {
        document.querySelector(`meta[property=${key}]`)['content'] = value;
      });
    }
  } else {
    status = constants.HTTP_STATUS_NOT_FOUND;
  }

  return res.status(status).send(document.documentElement.outerHTML);
});

export const ssr = functions.https.onRequest(app);
