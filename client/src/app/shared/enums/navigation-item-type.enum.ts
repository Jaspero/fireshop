export enum NavigationItemType {

  /**
   * Can be expanded and collapsed
   * to show or hide its children.
   */
  Expandable = 'expandable',

  /**
   * It's always expanded to show
   * its children
   */
  Expanded = 'expanded',

  /**
   * Navigates to an arbitrary link
   * in the app
   */
  Link = 'link',

  /**
   * Doesn't do anything
   */
  Empty = 'empty'
}
