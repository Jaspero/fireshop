import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';

export const SUB_CATEGORIES_MODULE = {
  id: 'sub-categories',
  name: 'Sub-Categories',
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
            '/category',
            '/description'
          ]
        }
      ]
    },
    table: {
      tableColumns: [
        {
          key: '/name',
          label: 'Name'
        },
        {
          key: '/url',
          label: 'URL'
        },
        {
          key: '/category',
          label: 'Category',
          populate: {
            collection: 'categories'
          }
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
      category: {type: 'string'},
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
    category: {
      label: 'Name',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'categories'
          }
        }
      }
    },
    ...CREATED_ON.definition(),
    
  }
};
