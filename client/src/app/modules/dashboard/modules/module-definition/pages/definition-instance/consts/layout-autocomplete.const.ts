export const LAYOUT_AUTOCOMPLETE = {
  filter: 'contain',
  caseSensitive: false,
  getOptions: (text, path) => {
    /**
     * Options available in root
     */
    if (path.length === 1) {
      return ['instance', 'order'];
    }

    if (path[0] === 'instance') {
      if (path[1] && path[1] === 'segments') {
        return [
          'fields',
          'array',
          'type',
          'title',
          'subTitle',
          'description',
          'nestedSegments',
          'columnsDesktop',
          'columnsTablet',
          'columnsMobile',
          'configuration',
          'classes',
          'id'
        ];
      }

      return ['segments'];
    }

    return [];
  }
};
