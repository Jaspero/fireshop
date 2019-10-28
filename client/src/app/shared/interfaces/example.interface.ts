export interface Example {
  name: string;
  json: {
    name?: string;
    description?: string;
    schema: object;
    layout: object;
    definitions: object;
  };
}
