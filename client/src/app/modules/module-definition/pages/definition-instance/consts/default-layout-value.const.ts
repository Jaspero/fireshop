export const DEFAULT_LAYOUT_VALUE = {
  icon: 'home',
  instance: {
    segments: [
      {
        columnsMobile: 12,
        columnsDesktop: 12,
        fields: [
          '/createdOn',
          '/name'
        ],
        title: 'Random'
      }
    ]
  },
  table: {
    tableColumns: [
      {
        key: '/name',
        label: 'Name'
      },
      {
        key: '/createdOn',
        label: 'Created On',
        pipe: 'date'
      }
    ]
  }
};
