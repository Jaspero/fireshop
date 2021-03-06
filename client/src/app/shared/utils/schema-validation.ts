import * as Ajv from 'ajv';

export class SchemaValidation {
  constructor() {
    this.schema = new Ajv();
  }

  schema: Ajv.Ajv;

  validate(schema) {
    let value;
    let error;

    try {
      value = this.schema.compile(schema);
      error = false;
    } catch (e) {
      error = true;
      value = e;
    }

    return {error, value};
  }
}
