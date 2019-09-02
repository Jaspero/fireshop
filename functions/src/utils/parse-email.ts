import * as sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin';
import {compile} from 'handlebars';
import {ENV_CONFIG} from '../consts/env-config.const';

export async function parseEmail(
  to: string,
  subject: string,
  template: string,
  context: any
) {
  const dbTemplate = (await admin
    .firestore()
    .doc(`settings/templates/templates/${template}`)
    .get()).data().value;

  const html = compile(dbTemplate)(context);

  sgMail.setApiKey(ENV_CONFIG.sendgrid.token);

  sgMail
    .send({
      to,
      from: {
        name: 'Jaspero Ltd',
        email: 'info@jaspero.co'
      },
      subject,
      text: 'Please use an HTML enabled client to view this email.',
      html
    })
    .then()
    .catch(error => console.error(error));

  return true;
}
