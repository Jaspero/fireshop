export const SETTINGS_COLLECTION = {
  name: 'settings',
  documents: [
    {
      id: 'user',
      roles: [
        /**
         * List all users that should be created initially.
         * Initially created users can only login through
         * third party provides (google, facebook...).
         * If you want to create a user with email/password
         * add an account for him in Authentication in the
         * firebase dashboard.
         */
        {
          email: 'info@jaspero.co',
          role: 'admin'
        }
      ]
    },
    {
      id: 'layout',
      navigation: {
        items: [
          {
            icon: 'dashboard',
            label: 'LAYOUT.DASHBOARD',
            type: 'link',
            value: '/dashboard'
          },
          {
            children: [
              {
                icon: 'workspaces',
                label: 'LAYOUT.PRODUCTS',
                type: 'link',
                value: '/m/products/overview'
              },
              {
                icon: 'style',
                label: 'LAYOUT.CATEGORIES',
                type: 'link',
                value: '/m/categories/overview'
              },
              {
                icon: 'games',
                label: 'LAYOUT.SUB_CATEGORIES',
                type: 'link',
                value: '/m/sub-categories/overview'
              }
            ],
            icon: 'inventory_2',
            label: 'LAYOUT.INVENTORY',
            type: 'expandable'
          },
          {
            children: [
              {
                icon: 'supervised_user_circle',
                label: 'GENERAL.USERS',
                type: 'link',
                value: '/m/users/overview'
              },
              {
                icon: 'vpn_key',
                label: 'GENERAL.ROLES',
                type: 'link',
                value: '/m/roles/overview'
              }
            ],
            icon: 'account_box',
            label: 'LAYOUT.MANAGEMENT',
            type: 'expandable'
          },
          {
            children: [
              {
                icon: 'view_module',
                label: 'LAYOUT.MODULES',
                type: 'link',
                value: '/module-definition/overview'
              },
              {
                icon: 'settings',
                label: 'LAYOUT.SETTINGS',
                type: 'link',
                value: '/settings'
              }
            ],
            icon: 'dns',
            label: 'LAYOUT.SYSTEM',
            type: 'expandable'
          }
        ]
      }
    }
  ]
};
