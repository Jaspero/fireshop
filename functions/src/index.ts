import {initializeApp} from 'firebase-admin';

initializeApp();

// Triggers
export {userCreated} from './triggers/user-created';

// Rest
export {exportData} from './rest/export-data';
export {importData} from './rest/import-data';
