import {ModuleSubCollection} from './module-sub-collection.interface';

export interface ModuleMetadata {
  subCollections?: ModuleSubCollection[];

  /**
   * If autoSave is defined the page automatically saves every x milliseconds
   * if the value is set to 0 then the page automatically saves on every change
   */
  autoSave?: number;
  [key: string]: any;
}
