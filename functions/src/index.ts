import {initializeApp} from 'firebase-admin';

initializeApp();

// Triggers
export {userCreated} from './triggers/user-created';
export {fileCreated} from './triggers/file-created';
export {fileDeleted} from './triggers/file-deleted';

// Rest
export {exportData} from './rest/export-data';
export {importData} from './rest/import-data';
