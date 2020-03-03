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

  if (!to) {
    console.error('Missing receiver email');
    return false;
  }

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

  const [layoutDoc, templateDoc] = await Promise.all(toExec);

  if (!layoutDoc.exists) {
    console.error('Email layout document missing');
    return false;
  }

  if (templateDoc && !templateDoc.exists) {
    console.log('Email not sent because document is undefined');
    return false;
  }

  [layout, dbTemplate] = [layoutDoc, templateDoc].map(
    // @ts-ignore
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
