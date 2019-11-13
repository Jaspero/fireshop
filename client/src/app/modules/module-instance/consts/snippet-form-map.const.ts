import {ComponentType} from '../../../shared/interfaces/component-type.enum';

export const SNIPPET_FORM_MAP = {
  [ComponentType.Select]: {
    schema: {
      properties: {
        multiple: {
          type: 'boolean'
        },
        dataSet: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              value: {
                type: 'string'
              },
              disabled: {
                type: 'boolean'
              }
            }
          }
        }
      }

    }
  },
  [ComponentType.Image]: {
    schema: {
      properties: {
        preventServerUpload: {
          type: 'boolean'
        }
      }

    }
  },
  [ComponentType.Gallery]: {
    schema: {
      properties: {
        allowServerUpload: {
          type: 'boolean'
        },
        allowUrl: {
          type: 'boolean'
        }
      }

    }
  },
  [ComponentType.Date]: {
    schema: {
      properties: {
        startYear: {
          type: 'string'
        },
        startAt: {
          type: 'string'
        },
        touchUi: {
          type: 'boolean'
        },
        startView: {
          type: 'string'
        },
        format: {
          type: 'string'
        }
      }

    }
  },
  [ComponentType.Slider]: {
    schema: {
      properties: {
        validation: {
          type: 'object',
          properties: {
            minimum: {
              type: 'number'
            },
            maximum: {
              type: 'number'
            }
          }
        },
        thumbLabel: {
          type: 'string'
        },
        tickInterval: {
          type: 'number'
        },
        startAt: {
          type: 'number'
        },
        endAt: {
          type: 'number'
        }
      }

    }
  },
  [ComponentType.Draggable]: {
    schema: {
      properties: {
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              value: {
                type: 'string'
              },
              disabled: {
                type: 'boolean'
              }
            }
          }
        }
      }

    }  },
  [ComponentType.Radio]: {
    schema: {
      properties: {
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              value: {
                type: 'string'
              },
              disabled: {
                type: 'boolean'
              }
            }
          }
        }
      }

    }  },
  [ComponentType.Chips]: {
    schema: {
      properties: {
        selectable: {
          type: 'boolean'
        },
        removable: {
          type: 'boolean'

        },
        addOnBlur: {
          type: 'boolean'

        },
        unique: {
          type: 'boolean'

        }
      }

    }
  },
  [ComponentType.Textarea]: {
    schema: {
      properties: {
        rows: {
          type: 'number'
        },
        cols: {
          type: 'number'
        }
      }

    }
  }
};
