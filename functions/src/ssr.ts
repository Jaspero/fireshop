// import 'zone.js/dist/zone-node';
// import 'reflect-metadata';
// import {ngExpressEngine} from '@nguniversal/express-engine';
// import {REQUEST, RESPONSE} from '@nguniversal/express-engine/tokens';
// import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
// import {enableProdMode} from '@angular/core';
// import * as domino from 'domino';
// import * as express from 'express';
// import * as cors from 'cors';
import * as functions from 'firebase-functions';
//
// const win = domino.createWindow('');
//
// global['window'] = win;
// global['document'] = win.document;
// global['DOMTokenList'] = win['DOMTokenList'];
//
// enableProdMode();
//
// // const {
// //   AppServerModuleNgFactory,
// //   LAZY_MODULE_MAP
// // } = require('./../../dist/server/main');
// const DIST_FOLDER = './../../dist/public';
// const app = express();
//
// // app.engine('html', (_, options, callback) =>
// //   ngExpressEngine({
// //     bootstrap: AppServerModuleNgFactory,
// //     providers: [
// //       provideModuleMap(LAZY_MODULE_MAP),
// //       {
// //         provide: REQUEST,
// //         useValue: options.req
// //       },
// //       {
// //         provide: RESPONSE,
// //         useValue: options.req.res
// //       }
// //     ]
// //   })(_, options, callback)
// // );
//
// app.use(cors({origin: true}));
// app.set('view engine', 'html');
// app.set('views', DIST_FOLDER);
//
// app.get('*.*', express.static(DIST_FOLDER, {maxAge: '1y'}));
// app.get('*', (req, res) => {
//   res.render('index', {req});
// });
//
// export const ssr = functions.https.onRequest(app);
export const ssr = functions.https.onRequest(() => {
  console.log('123');
});
