const item = (text: string, value: any) => {
  return {
    text,
    title: `Insert a definition for a ${text.toLowerCase()} component`,
    field: 'pointer',
    value: {
      ...value,
      label: 'Add Label'
    }
  };
};
const options = [
  {name: 'Option 1', value: 'option-1', disabled: false},
  {name: 'Option 2', value: 'option-2', disabled: false},
  {name: 'Option 3', value: 'option-3', disabled: false}
];
const simpleItem = (text: string) => ({
  ...item(text, {
    component: text.toLowerCase()
  })
});

export const DEFINITION_TEMPLATES = [
  simpleItem('Input'),
  simpleItem('Wysiwyg'),
  simpleItem('Checkbox'),
  simpleItem('Toggle'),
  item('Textarea', {
    type: 'textarea',
    configuration: {
      rows: 10,
      cols: 10
    }
  }),
  item('Select', {
    type: 'select',
    configuration: {
      dataSet: options,
      multiple: false
    }
  }),
  item('Radio', {
    type: 'radio',
    configuration: {
      options
    }
  }),
  item('Draggable', {
    type: 'draggable',
    configuration: {
      options
    }
  }),
  item('Slider', {
    type: 'slider',
    configuration: {
      validation: {
        minimum: 10,
        maximum: 90
      },
      thumbLabel: true,
      tickInterval: 1,
      startAt: 0,
      endAt: 100
    }
  }),
  item('Image', {
    type: 'image',
    configuration: {
      preventServerUpload: false
    }
  }),
  item('Gallery', {
    component: {
      type: 'gallery',
      configuration: {
        allowServerUpload: true,
        allowUrl: true
      }
    }
  }),
  item('Chips', {
    type: 'chips',
    configuration: {
      selectable: true,
      removable: true,
      addOnBlur: true,
      unique: true
    }
  }),
  item('Date', {
    type: 'date',
    configuration: {
      startYear: new Date().getFullYear(),
      startAt: Date.now(),
      touchUi: true,
      startView: 'month',
      format: 'number'
    }
  })
];
