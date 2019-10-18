/**
 * Generates firestore.indexes.json from collections array
 */
const {writeFileSync} = require('fs');
const collections = [
  {
    collection: 'products',
    queries: ['search', 'category', 'active'],
    sort: ['createdOn', 'name', 'price', 'active', 'quantity', 'order'],
    languages: ['en', 'hr']
  },
  {
    collection: 'categories',
    queries: ['name'],
    sort: ['createdOn', 'name', 'order'],
    languages: ['en', 'hr']
  },
  {
    collection: 'discounts',
    queries: ['name'],
    sort: ['createdOn', 'name', 'description'],
    languages: ['en', 'hr']
  },
  {
    collection: 'customers',
    queries: ['name'],
    sort: ['createdOn', 'name', 'gender', 'email'],
    languages: ['']
  },
  {
    collection: 'orders',
    queries: ['status', 'customerId'],
    sort: ['createdOn', 'status', 'customerName'],
    languages: ['']
  },
  {
    collection: 'reviews',
    queries: ['customerName'],
    sort: ['createdOn', 'customerName', 'rating'],
    languages: ['']
  }
];

writeFileSync(
  'firestore.indexes.json',
  JSON.stringify(
    collections.reduce((acc, cur) => {

      cur.languages.forEach(language => {

        const base = {
          collectionGroup: cur.collection + (language ? `-${language}` : ''),
          queryScope: 'COLLECTION'
        };

        cur.queries.forEach(query => {

          acc.indexes.push(
            ...cur.sort.reduce((indexes, sort) => {

              if (sort !== query) {
                indexes.push(
                  {
                    ...base,
                    fields: [
                      {
                        fieldPath: query,
                        ...query === 'search' ? {arrayConfig: 'CONTAINS'} : {order: 'ASCENDING'}
                      },
                      {
                        fieldPath: sort,
                        order: 'DESCENDING'
                      }
                    ]
                  },
                  {
                    ...base,
                    fields: [
                      {
                        fieldPath: query,
                        ...query === 'search' ? {arrayConfig: 'CONTAINS'} : {order: 'ASCENDING'}
                      },
                      {
                        fieldPath: sort,
                        order: 'ASCENDING'
                      }
                    ]
                  }
                );
              }

              return indexes;
            }, [])
          )

        })

      });


      return acc;
    }, {
      indexes: [],
      fieldOverrides: []
    }),
    null,
    2
  )
);


