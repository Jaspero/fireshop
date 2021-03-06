interface Module {
  name?: string;
  description?: string;
  schema: any;
  layout: any;
  definitions: any;
}

export interface Snippet {
  definition: {
    text: string;
    title: string;
    field: string;
    value: any;
  };
  property: {
    type: string;
  };
  schema: {
    type: string;
  };
}

export interface Example {
  name: string;
  json: Module | Snippet;
}
