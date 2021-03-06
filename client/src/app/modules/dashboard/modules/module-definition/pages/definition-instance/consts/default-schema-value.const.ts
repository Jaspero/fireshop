export const DEFAULT_SCHEMA_VALUE = {
  properties: {
    name: {
      type: 'string'
    },
    createdOn: {
      type: 'number'
    }
  },
  additionalProperties: false,
  required: [
    'name'
  ]
};
