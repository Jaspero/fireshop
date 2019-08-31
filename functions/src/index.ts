import {initializeApp} from 'firebase-admin';

initializeApp();

// Triggers
export {userCreated} from './triggers/user-created';
export {userDeleted} from './triggers/user-deleted';
export {fileCreated} from './triggers/file-created';
export {fileDeleted} from './triggers/file-deleted';

// Callable
export {createUser} from './callable/create-user';
export {removeUser} from './callable/remove-user';

// Rest
export {exportData} from './rest/export-data';
export {importData} from './rest/import-data';
