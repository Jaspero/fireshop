import * as functions from 'firebase-functions';

export const ENV_CONFIG = functions.config() as {
  sendgrid: {
    token: string;
  };
  stripe: {
    token: string;
    webhook: string;
  };
  instagram: {
    clientid: string;
    clientsecret: string;
  };
};
