const item = (text: string, value: any) => {
  return {
    text: `Component - ${text}`,
    title: `Insert a definition for a ${text.toLowerCase()} component`,
    field: 'pointer',
    value: {
      ...value,
      label: 'Add Label'
    }
  };
};
const simpleItem = (text: string) => ({
  ...item(text, {
    component: text.toLowerCase()
  })
});

export const DEFINITION_TEMPLATES = [
  simpleItem('Input'),
  simpleItem('Checkbox'),
  simpleItem('Wysiwyg'),
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
