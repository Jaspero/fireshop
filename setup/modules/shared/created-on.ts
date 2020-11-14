export const CREATED_ON = {
  sort: {
    active: 'createdOn',
    direction: 'desc'
  },
  column: (sortable = true, format?: string) => ({
    key: '/createdOn',
    label: 'GENERAL.DATE',
    pipe: ['date'],
    ...sortable && {sortable: true},
    ...format && {
      pipeArguments: {
        0: [format]
      }
    }
  }),
  property: {
    createdOn: {type: 'number'}
  },
  definition: (
    id = 'createdOn',
    label = 'GENERAL.CREATED_ON',
    createInitially = true
  ) => ({
    [id]: {
      label,
      ...createInitially && {
        disableOn: 'edit',
        formatOnSave: '(value) => value || Date.now()',
      },
      component: {
        type: 'date',
        configuration: {
          includeTime: true,
          labelHours: 'GENERAL.HOURS',
          labelMinutes: 'GENERAL.MINUTES',
          format: 'number'
        }
      }
    },
  })
};
