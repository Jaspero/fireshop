import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';


export const CATEGORIES_MODULE = {
  id: 'categories',
  name: 'Categories',
  authorization: {
    write: ['admin']
  },
  layout: {
    editTitleKey: 'name',
    sort: CREATED_ON.sort,
    instance: {
      segments: [
        {
          fields: [
            '/url',
            '/name',
            '/description'
          ]
        }
      ]
    },
    table: {
      tableColumns: [
        {
          key: '/url',
          label: 'URL'
        },
        {
          key: '/name',
          label: 'Name'
        },
        CREATED_ON.column()
      ]
    }
  },
  schema: {
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      url: {type: 'string'},
      ...CREATED_ON.property
    }
  },
  definitions: {
    id: {label: 'ID', disableOn: 'edit'},
    name: {label: 'Name'},
    url: {
      label: 'URL',
      formatOnSave: FORMAT_SEARCH('url'),
      hint: 'Generated automatically from name if left empty.'
    },
    ...CREATED_ON.definition(),
    
  }
};
