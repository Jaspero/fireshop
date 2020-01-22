import {Request, Response, NextFunction} from 'express';
import * as admin from 'firebase-admin';

export async function authenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).send('Unauthorized');
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];

  try {
    // @ts-ignore
    req['user'] = await admin.auth().verifyIdToken(idToken);
    next();
    return;
  } catch (error) {
    return res.status(403).send('Unauthorized');
  }
}
