export interface SearchModule {
  key: string;

  /**
   * If a search is simple it expects to
   * look for exact matches in a string.
   * An advanced search looks for exact matches
   * in an array of strings.
   */
  simple: boolean;
}
