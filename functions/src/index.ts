import {initializeApp} from 'firebase-admin';

initializeApp();

export {ssr} from './ssr';

// Triggers
export {userCreated} from './triggers/user-created';
export {userDeleted} from './triggers/user-deleted';
export {fileCreated} from './triggers/file-created';
export {fileDeleted} from './triggers/file-deleted';

// Rest
export {exportData} from './rest/export-data';
export {importData} from './rest/import-data';
export {similarProducts} from './rest/similar-products';
export {stripe} from './rest/stripe';
