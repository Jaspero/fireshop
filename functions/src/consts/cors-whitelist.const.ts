import * as cors from 'cors';

export const CORS = cors({
  origin: ['https://jaspero-jms.web.app'],
  optionsSuccessStatus: 200,
  methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
});
