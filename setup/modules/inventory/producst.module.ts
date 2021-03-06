import {CREATED_ON} from '../shared/created-on';
import {FORMAT_SEARCH} from '../shared/format-search';


export const PRODUCTS_MODULE = {
  id: 'products',
  name: 'Products',
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
            '/categories',
            '/subCategories'
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
          key: 'URL',
          label: 'URL'
        },
        {
          key: '/categories',
          label: 'Categories',
          populate: {
            collection: 'categories'
          }
        },
        {
          key: '/subCategories',
          label: 'Sub-Categories',
          populate: {
            collection: 'sub-categories'
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
      categories: {type: 'array'},
      subCategories: {type: 'array'},
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
    categories: {
      label: 'Categories',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'categories'
          }
        }
      }
    },
    subCategories: {
      label: 'Sub-Categories',
      component: {
        type: 'select',
        configuration: {
          populate: {
            collection: 'sub-categories'
          }
        }
      }
    },
    ...CREATED_ON.definition(),
  }
};
