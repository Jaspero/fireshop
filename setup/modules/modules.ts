import {ROLES_MODULE} from './roles.module';
import {USERS_MODULE} from './users.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,

  {
    id: 'users~{docId}~notes',
    name: 'User Notes',
    layout: {
      authorization: {
        read: ['admin'],
        write: ['admin']
      },
      instance: {
        segments: [
          {
            fields: ['/note']
          }
        ]
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
        id: {type: 'string'},
        note: {type: 'string'}
      }
    }
  }
];
