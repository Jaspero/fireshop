export const COLLECTIONS_METADATA = [
  {
    expression: new RegExp(/^products-.{2}$/),
    subCollections: [
      {
        name: 'metadata',
        batch: 1
      }
    ]
  }
];
