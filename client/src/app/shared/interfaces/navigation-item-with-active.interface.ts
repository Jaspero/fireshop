import {NavigationItem} from './navigation-item.interface';

export interface NavigationItemWithActive extends NavigationItem {
  active?: boolean;
  routerOptions: {
    exact: boolean;
  };
}
