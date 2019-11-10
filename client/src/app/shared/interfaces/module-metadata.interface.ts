import {ModuleSubCollection} from './module-sub-collection.interface';

export interface ModuleMetadata {
  subCollections?: ModuleSubCollection[];
  [key: string]: any;
}
