import {NavigationItemType} from '../enums/navigation-item-type.enum';

export interface NavigationItem {
  label: string;

  /**
   * Can be a function
   * (user, role) => role ? 'a' : 'b'
   */
  value: string;
  icon?: string;
  function?: boolean;

  /**
   * Defaults to 'empty' if unassigned
   */
  type?: NavigationItemType;
  children?: NavigationItem[];

  /**
   * Roles that are authorized to view
   * this item
   */
  authorized?: string[];

  /**
   * Should the router link option {exact: true} be applied
   */
  matchExact?: boolean;
}
