import * as cookieParser from 'cookie-parser';
import {randomBytes} from 'crypto';
import * as express from 'express';
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {create} from 'simple-oauth2';
import {ENV_CONFIG} from '../consts/env-config.const';
import {HttpStatus} from '../enums/http-status.enum';

const oauth2 = create({
  client: {
    id: ENV_CONFIG.instagram.clientid,
    secret: ENV_CONFIG.instagram.clientsecret
  },
  auth: {
    tokenHost: 'https://api.instagram.com',
    tokenPath: '/oauth/access_token'
  }
});

const app = express();
app.enable('trust proxy');
app.use(cookieParser());

app.get('/redirect', (req, res) => {
  const state = req.cookies.state || randomBytes(20).toString('hex');

  res.cookie('state', state, {
    maxAge: 3600000,
    secure: req.get('host').indexOf('localhost:') !== 0,
    httpOnly: true
  });

  console.log(`${req.protocol}://${req.get('host')}/instagram/callback`);

  res.redirect(
    oauth2.authorizationCode.authorizeURL({
      redirect_uri: `${req.protocol}://${req.get('host')}/instagram/callback`,
      scope: 'basic',
      state
    })
  );
});

app.get('/callback', async (req, res) => {
  if (!req.cookies.state) {
    return res
      .status(HttpStatus.BadRequest)
      .send(
        'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
      );
  } else if (req.cookies.state !== req.query.state) {
    return res.status(HttpStatus.BadRequest).send('State validation failed');
  }

  const results = await oauth2.authorizationCode.getToken({
    code: req.query.code,
    redirect_uri: `${req.protocol}://${req.get('host')}/instagram/callback`
  });

  const firebaseToken = await createFirebaseAccount(
    results.user.id,
    results.user.full_name,
    results.user.profile_picture,
    results.access_token
  );

  res.send(signInFirebaseTemplate(firebaseToken));
});

function createFirebaseAccount(
  instagramID,
  displayName,
  photoURL,
  accessToken
) {
  const uid = `instagram:${instagramID}`;
  const databaseTask = admin
    .firestore()
    .collection(`instagramAccessToken`)
    .doc(instagramID)
    .set(accessToken);
  const userCreationTask = admin
    .auth()
    .updateUser(uid, {
      displayName: displayName,
      photoURL: photoURL
    })
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: uid,
          displayName: displayName,
          photoURL: photoURL
        });
      }

      throw error;
    });

  return Promise.all([userCreationTask, databaseTask]).then(() => {
    return admin.auth().createCustomToken(uid);
  });
}

function signInFirebaseTemplate(token) {
  return `<html>
    <head>
      <title>Instagram Login</title>
    </head>
    <body>
      <script src="/__/firebase/6.0.2/firebase-app.js"></script>
      <script src="/__/firebase/6.0.2/firebase-auth.js"></script>
      <script src="/__/firebase/init.js"></script>
      <script>
        firebase.auth().signInWithCustomToken('${token}').then(function() {
          window.close();
        });
      </script>
    </body>  
  </html>`;
}

export const instagram = functions.https.onRequest(app);
