export const LAYOUT_AUTOCOMPLETE = {
  filter: 'contain',
  caseSensitive: false,
  getOptions: (text, path) => {
    console.log('path', path);

    /**
     * Options available in root
     */
    if (path.length === 1) {
      return ['instance', 'order'];
    }

    if (path[0] === 'instance') {
      return ['segments'];
    }

    return [];
  }
};
