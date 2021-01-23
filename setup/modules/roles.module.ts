import {CREATED_ON} from './shared/created-on';

export const ROLES_MODULE = {
  id: 'roles',
  name: 'Roles',
  description: 'Collection of roles that can be assigned to users',
  authorization: {
    read: ['admin'],
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          components: [
            {
              selector: 'duplicate'
            }
          ]
        },
        {
          fields: [
            '/createdOn',
            '/name',
            '/description'
          ]
        }
      ]
    },
    table: {
      tableColumns: [
        CREATED_ON.column(),
        {
          key: '/name',
          label: 'Name'
        },
        {
          key: '/description',
          label: 'Description'
        }
      ],
      actions: [
        {
          value: `it => '<jms-e-new-prepopulate collection="users" data-name="Prefill Test" data-email="{{it.data.description}}" label="Assign User"></jms-e-new-prepopulate>'`
        }
      ]
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
      description: {
        type: 'string',
      },
      ...CREATED_ON.property
    },
    required: [
      'name',
      'createdOn'
    ]
  },
  definitions: {
    name: {
      label: 'Name'
    },
    description: {
      label: 'Description',
      component: {
        type: 'textarea'
      }
    },
    ...CREATED_ON.definition()
  }
};
