import {initializeApp} from 'firebase-admin';

initializeApp();

// Callable
export {exampleEmail} from './callable/example-email';
export {countries} from './callable/countries';
export {currencies} from './callable/currencies';

// Triggers
export {userCreated} from './triggers/user-created';
export {userDeleted} from './triggers/user-deleted';
export {fileCreated} from './triggers/file-created';
export {fileDeleted} from './triggers/file-deleted';
export {customerDeleted} from './triggers/customer-deleted';
export {documentDeleted} from './triggers/document-deleted';
export {giftCardCreated} from './triggers/gift-card-created';

// Rest
export {exportData} from './rest/export-data';
export {importData} from './rest/import-data';
export {similarProducts} from './rest/similar-products';
export {stripe} from './rest/stripe';
export {instagram} from './rest/instagram-authorization';

export {ssr} from './ssr';
