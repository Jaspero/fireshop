import {ROLES_MODULE} from './roles.module';
import {USERS_MODULE} from './users.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,

  {
    id: 'users~{documentId}~notes',
    name: 'User Notes',
    layout: {
      authorization: {
        read: ['admin'],
        write: ['admin']
      },
      table: {
        tableColumns: [
          {
            key: '/note',
            label: 'Note'
          }
        ]
      }
    },
    schema: {
      properties: {
        note: {type: 'string'}
      }
    }
  }
];
