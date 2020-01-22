import * as cors from 'cors';

export const CORS = cors({
  origin: [
    'https://jaspero-jms.web.app/'
  ],
  optionsSuccessStatus: 200
});
