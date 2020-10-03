import * as cors from 'cors';

export const CORS = cors({
  origin: [
    'https://jaspero-jms.web.app',
    ...process.env.NODE_ENV !== 'production' ? ['http://localhost:4200'] : []
  ],
  optionsSuccessStatus: 200,
  methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
});
