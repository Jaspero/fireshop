interface Module {
  name?: string;
  description?: string;
  schema: object;
  layout: object;
  definitions: object;
}

interface Snippet {
  definition: {
    text: string;
    title: string;
    field: string;
    value: object;
  };
  property: {
    type: string;
  };
}

export interface Example {
  name: string;
  json: Module | Snippet;
}
