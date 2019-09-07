import {ComponentType} from '../../../../../shared/interfaces/component-type.enum';

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
