export interface ModuleSubCollection {
  name: string;

  /**
   * Maximum number of files that can be deleted
   * when the originating document is deleted.
   * Defaults to 100 if not set
   */
  batch?: number;
}
