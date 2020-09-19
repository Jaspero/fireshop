import {Request, Response, NextFunction} from 'express';
import * as admin from 'firebase-admin';

export function authenticated(roles?: string[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(403).send('Unauthorized');
    }

    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {

      const user = await admin.auth().verifyIdToken(idToken);

      // @ts-ignore
      req['user'] = user;

      if (roles && !roles.includes(user.role)) {
        return res.status(403).send('Unauthorized');
      }

      next();
      return;
    } catch (error) {
      return res.status(403).send('Unauthorized');
    }
  }
}
