import {NavigationItemType} from '../enums/navigation-item-type.enum';

export interface NavigationItem {
  label: string;
  value: string;
  icon?: string;

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
}
