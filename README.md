[![CircleCI](https://circleci.com/gh/Jaspero/jms.svg?style=svg)](https://circleci.com/gh/Jaspero/jms)

# JMS

JMS is a CMS based on Angular that is fully configurable through JSON schema-s.
Currently it only supports [firestore](https://firebase.google.com/docs/firestore) as its
database but other implementations are planed.

A live example can be found [here](https://github.com/Jaspero/jms).

## Modules

A module represents a collection in the database. It consists of three
configurations a **schema**, **layout** and **definitions**.

## Schema

The schema is a standard [JSON Schema](https://json-schema.org/) it's used
to define the format of documents in the collection.

### Example

```json
{
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    }
  }
}
```

## Layout

The layout is used for configuring how the schema is displayed in the overview and form segments.
Below is the layout definition:

```ts
{
  icon?: string;
  table?: {
    sort?: TableSort;
    tableColumns?: TableColumn[];
  };
  instance: {
    segments: InstanceSegment[];
  };
}
```

**Table Column**

**Instance Segments**

### Example

## Definitions

This configuration is sued for defining addition field based options. Changing the label or
what component is used to represent the field in the form. The `ModuleDefinition` looks like this:

| Property     | Type   | Description                                                                                                                                              | Default                                        |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| label        | string | Label of the field                                                                                                                                       | uses the name of the property                  |
| hint         | string | Shows a hint below the field if defined                                                                                                                  | -                                              |
| defaultValue | any    | What the value of the field should be if empty                                                                                                           | -                                              |
| component    | object | `{type: string, configuration: any}` - The `type` defines the field to use and the `configuration` is used for any additional component specific options | What ever is the default for the property type |

**Component Types**

| Name  | Selector | Description    | Configuration Options               |
| ----- | -------- | -------------- | ----------------------------------- |
| Input | input    | A simple input | `{type: 'text', 'number', 'email'}` |

### Example

```ts
{
  "/name": {
    "label": "Name",
    "defaultValue: "John"
  },
  "/age": {
    "label": "Age",
    "component": {
      "type": "slider"
    }
  }
}
```
