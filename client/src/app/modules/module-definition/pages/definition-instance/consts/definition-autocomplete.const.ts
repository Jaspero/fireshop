import {ComponentType} from '@jaspero/form-builder';


export const DEFINITION_AUTOCOMPLETE = {
  filter: 'contain',
  caseSensitive: false,
  getOptions: (text, path) => {
    if (path.length === 1) {
      return Object.values(ComponentType);
    }

    if (path.length === 2) {
      return ['component', 'label'];
    }

    return [];
  }
};
