import * as functions from 'firebase-functions';

export const ENV_CONFIG = functions.config()[process.env.NODE_ENV === 'production' ? 'prod' : 'dev'] as {};
