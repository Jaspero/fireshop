import {CREATED_ON} from './shared/created-on';

export const USERS_MODULE = {
  id: 'users',
  name: 'Users',
  description: 'App Users',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    filterModule: {
      persist: true,
      schema: {
        properties: {
          role: {
            type: 'string'
          }
        }
      },
      definitions: {
        role: {
          label: 'Role',
          component: {
            type: 'select',
            configuration: {
              populate: {
                collection: 'roles'
              }
            }
          }
        }
      },
      segments: [{
        type: 'empty',
        fields: [
          '/role'
        ]
      }]
    },
    sort: CREATED_ON.sort,
    instance: {
      segments: [{
        fields: [
          '/createdOn',
          '/id',
          '/name',
          '/email',
          '/role'
        ]
      }]
    },
    table: {
      hideImport: true,
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'Name'
        },
        {
          key: '/email',
          label: 'Email'
        },
        {
          key: '/role',
          label: 'Role',
          control: true
        }
      ],
      actions: [
        {
          value: `it => '<jms-e-tpr data-email="' + it.data.email + '"></jms-e-tpr>'`
        },
        {
          value: `it => '<jms-e-cp data-id="' + it.id + '"></jms-e-cp>'`
        },
        {
          value: `it => '<jms-e-tus data-id="' + it.id + '"></jms-e-tus>'`
        },
        {
          value: `it => '<jms-e-notes data-id="' + it.id + '"></jms-e-notes>'`
        }
      ]
    },
    overview: {
      toolbar: ['<jms-e-user-add></jms-e-user-add>']
    }
  },
  schema: {
    properties: {
      id: {
        type: 'string'
      },
      name: {
        type: 'string',
      },
      email: {
        type: 'number'
      },
      role: {
        type: 'string'
      },
      ...CREATED_ON.property
    }
  },
  definitions: {
    id: {
      type: 'ID'
    },
    name: {
      label: 'Name'
    },
    email: {
      label: 'Email',
      component: {
        type: 'input',
        configuration: {
          type: 'email'
        }
      }
    },
    role: {
      label: 'Role',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'roles',
            orderBy: 'name'
          }
        }
      }
    },
    ...CREATED_ON.definition()
  }
};
