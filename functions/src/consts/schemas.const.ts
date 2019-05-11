export const categories = {
  title: 'Categories Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    }
  },
  required: ['id', 'name']
};

export const product = {
  title: 'Product Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    category: {
      type: 'string'
    },
    price: {
      type: 'number'
    },
    active: {
      type: 'boolean'
    },
    createdOn: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    shortDescription: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    gallery: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    search: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['id', 'category', 'price', 'active', 'name']
};

export const discount = {
  title: 'Discount Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    }
  },
  required: ['id', 'name']
};

export const order = {
  title: 'Order Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    paymentIntentId: {
      type: 'string'
    },
    price: {
      type: 'object',
      properties: {
        total: {
          type: 'number'
        },
        shipping: {
          type: 'number'
        },
        subTotal: {
          type: 'number'
        }
      },
      required: ['total', 'shipping', 'subTotal']
    },
    billing: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        phone: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        zip: {
          type: 'string'
        },
        country: {
          type: 'string'
        },
        line1: {
          type: 'string'
        },
        line2: {
          type: 'string'
        }
      },
      required: [
        'firstName',
        'lastName',
        'email',
        'lastName',
        'phone',
        'city',
        'zip',
        'country',
        'line1'
      ]
    },
    shipping: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        phone: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        zip: {
          type: 'string'
        },
        country: {
          type: 'string'
        },
        line1: {
          type: 'string'
        },
        line2: {
          type: 'string'
        }
      },
      required: [
        'firstName',
        'lastName',
        'email',
        'lastName',
        'phone',
        'city',
        'zip',
        'country',
        'line1'
      ]
    },
    createdOn: {
      type: 'number'
    },
    orderItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          quantity: {
            type: 'number'
          },
          name: {
            type: 'string'
          },
          price: {
            type: 'number'
          },
          attributes: {
            type: 'any'
          }
        },
        required: ['id', 'quantity', 'name', 'price']
      }
    },
    email: {
      type: 'string'
    },
    customerId: {
      type: 'string'
    },
    customerName: {
      type: 'string'
    },
    error: {
      type: 'string'
    }
  },
  required: ['id', 'price', 'billing', 'orderItems', 'email']
};

export const customer = {
  title: 'Customer Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    createdOn: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    profileImage: {
      type: 'string'
    },
    billing: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        phone: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        zip: {
          type: 'string'
        },
        country: {
          type: 'string'
        },
        line1: {
          type: 'string'
        },
        line2: {
          type: 'string'
        }
      },
      required: [
        'firstName',
        'lastName',
        'email',
        'lastName',
        'phone',
        'city',
        'zip',
        'country',
        'line1'
      ]
    },
    shippingInfo: {
      type: 'boolean'
    },
    shipping: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        phone: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        zip: {
          type: 'string'
        },
        country: {
          type: 'string'
        },
        line1: {
          type: 'string'
        },
        line2: {
          type: 'string'
        }
      },
      required: [
        'firstName',
        'lastName',
        'email',
        'lastName',
        'phone',
        'city',
        'zip',
        'country',
        'line1'
      ]
    },
    wishList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          addedOn: {
            type: 'number'
          }
        },
        required: ['productId', 'name']
      }
    },
    orders: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          paymentIntentId: {
            type: 'string'
          },
          price: {
            type: 'object',
            properties: {
              total: {
                type: 'number'
              },
              shipping: {
                type: 'number'
              },
              subTotal: {
                type: 'number'
              }
            },
            required: ['total', 'shipping', 'subTotal']
          },
          billing: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              phone: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              zip: {
                type: 'string'
              },
              country: {
                type: 'string'
              },
              line1: {
                type: 'string'
              },
              line2: {
                type: 'string'
              }
            },
            required: [
              'firstName',
              'lastName',
              'email',
              'lastName',
              'phone',
              'city',
              'zip',
              'country',
              'line1'
            ]
          },
          shipping: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              phone: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              zip: {
                type: 'string'
              },
              country: {
                type: 'string'
              },
              line1: {
                type: 'string'
              },
              line2: {
                type: 'string'
              }
            },
            required: [
              'firstName',
              'lastName',
              'email',
              'lastName',
              'phone',
              'city',
              'zip',
              'country',
              'line1'
            ]
          },
          createdOn: {
            type: 'number'
          },
          orderItems: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string'
                },
                quantity: {
                  type: 'number'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                attributes: {
                  type: 'any'
                }
              },
              required: ['id', 'quantity', 'name', 'price']
            }
          },
          email: {
            type: 'string'
          },
          customerId: {
            type: 'string'
          },
          customerName: {
            type: 'string'
          },
          error: {
            type: 'string'
          }
        },
        required: ['id', 'price', 'billing', 'orderItems', 'email']
      }
    },
    reviews: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: {
            type: 'string'
          },
          review: {
            type: 'object',
            properties: {
              title: {
                type: 'string'
              },
              snippet: {
                type: 'string'
              },
              rating: {
                type: 'number'
              }
            },
            required: ['title', 'snippet', 'rating']
          },
          createdOn: {
            type: 'number'
          }
        },
        required: ['productId', 'review', 'createdOn']
      }
    }
  },
  required: ['id']
};

export const review = {
  title: 'Review Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    productId: {
      type: 'string'
    },
    customerId: {
      type: 'string'
    },
    customerName: {
      type: 'string'
    },
    orderId: {
      type: 'string'
    },
    createdOn: {
      type: 'number'
    },
    rating: {
      type: 'number'
    },
    comment: {
      type: 'string'
    }
  },
  required: ['id']
};
