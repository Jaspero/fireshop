import {initializeApp} from 'firebase-admin';
import {createUser} from './callable/create-user';
import {getUser} from './callable/get-user';
import {removeUser} from './callable/remove-user';
import {triggerPasswordReset} from './callable/trigger-password-reset';
import {updateUser} from './callable/update-user';
import {actionController} from './rest/action-controller';
import {api} from './rest/api';
import {exportData} from './rest/export-data';
import {importData} from './rest/import-data';
import {fileCreated} from './triggers/file-created';
import {fileDeleted} from './triggers/file-deleted';
import {userCreated} from './triggers/user-created';
import {userDeleted} from './triggers/user-deleted';
import {jsonSchemaToTypescript} from './callable/json-schema-to-typescript';
import {documentDeleted} from './triggers/document-deleted';
import {getExamples} from './callable/get-examples';
import {userDocumentUpdated} from './triggers/user-document-updated';

initializeApp();

export const cms = {
  // Triggers
  userCreated,
  userDeleted,
  userDocumentUpdated,
  fileCreated,
  fileDeleted,
  documentDeleted,
  triggerPasswordReset,

  // Callable
  createUser,
  removeUser,
  jsonSchemaToTypescript,
  getExamples,
  updateUser,
  getUser,

  // Rest
  exportData,
  importData,
  api,
  actionController
};
