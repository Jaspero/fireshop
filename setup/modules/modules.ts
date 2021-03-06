import {CATEGORIES_MODULE} from './inventory/categories.module';
import {PRODUCTS_MODULE} from './inventory/producst.module';
import {SUB_CATEGORIES_MODULE} from './inventory/sub-categories.module';
import {ROLES_MODULE} from './roles.module';
import {USERS_MODULE} from './users.module';

/**
 * Schemas for all of the modules
 */
export const MODULES = [
  USERS_MODULE,
  ROLES_MODULE,

  /**
   * Inventory
   */
  CATEGORIES_MODULE,
  SUB_CATEGORIES_MODULE,
  PRODUCTS_MODULE
];
