import * as sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin';
import {compile, registerPartial} from 'handlebars';
import {ENV_CONFIG} from '../consts/env-config.const';

export async function parseEmail(
  to: string,
  subject: string,
  template: string,
  context: any,
  loadTemplate = true
) {
  let layout: string;
  let dbTemplate: string;

  const toExec = [
    admin
      .firestore()
      .doc(`settings/templates/templates/layout`)
      .get()
  ];

  if (loadTemplate) {
    toExec.push(
      admin
        .firestore()
        .doc(`settings/templates/templates/${template}`)
        .get()
    );
  }

  [layout, dbTemplate] = (await Promise.all(toExec)).map(
    item => item.data().value
  );

  if (!loadTemplate) {
    dbTemplate = template;
  }

  registerPartial('body', dbTemplate);

  const html = compile(layout)(context);

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
