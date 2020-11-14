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
    }
  },
  definitions: {
    name: {
      label: 'Name',
      columnsDesktop: 4,
      columnsMobile: 12
    },
    description: {
      label: 'Description',
      component: {
        type: 'textarea'
      },
      columnsDesktop: 4,
      columnsMobile: 12
    },
    ...CREATED_ON.definition()
  }
};
