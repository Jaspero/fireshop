import {ComponentType, State} from '@jaspero/form-builder';
import {JSONSchema7} from 'json-schema';
import {FilterModule} from './filter-module.interface';
import {ImportModule} from './import-module.interface';
import {InstanceSort} from './instance-sort.interface';
import {ModuleAuthorization} from './module-authorization.interface';
import {ModuleInstance} from './module-instance.interface';
import {ModuleLayoutTable} from './module-layout-table.interface';
import {ModuleMetadata} from './module-metadata.interface';
import {ModuleOverview} from './module-overview.interface';
import {SearchModule} from './search-module.interface';
import {SortModule} from './sort-module.interface';

export interface ModuleLayout {
  icon?: string;
  editTitleKey?: string;
  order?: number;

  /**
   * ID of a document in the collection.
   * If added the dashboard link navigates
   * directly to the provided id.
   */
  directLink?: string;
  sort?: InstanceSort;
  pageSize?: number;
  table?: ModuleLayoutTable;
  sortModule?: SortModule;
  filterModule?: FilterModule;
  importModule?: ImportModule;
  searchModule?: SearchModule;
  instance?: ModuleInstance;
  overview?: ModuleOverview;
}

export interface ComponentDefinition {
  type: ComponentType;
  configuration?: any;
}

export interface ModuleDefinition {
  component?: ComponentDefinition;
  formatOnSave?: string;
  formatOnCreate?: string;
  formatOnEdit?: string;
  formatOnLoad?: string;
  label?: string;
  hint?: string;
  defaultValue?: any;
  placeholder?: string;
  onlyOn?: State;
  disableOn?: State;
}

export interface ModuleDefinitions {
  [key: string]: ModuleDefinition;
}

export interface Module {
  id: string;
  createdOn: number;
  name: string;
  order: number;
  description: string;
  schema: JSONSchema7;
  layout?: ModuleLayout;
  definitions?: ModuleDefinitions;
  authorization?: ModuleAuthorization;
  metadata?: ModuleMetadata;
}
