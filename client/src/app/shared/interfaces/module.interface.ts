import {JSONSchema7} from 'json-schema';
import {InstanceSingleState} from '../../modules/module-instance/enums/instance-single-state.enum';
import {SegmentType} from '../../modules/module-instance/enums/segment-type.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {ComponentType} from './component-type.enum';
import {FilterModule} from './filter-module.interface';
import {ModuleMetadata} from './module-metadata.interface';
import {SearchModule} from './search-module.interface';
import {SortModule} from './sort-module.interface';
import {ModuleAuthorization} from './module-authorization.interface';

export interface TableColumn {
  /**
   * This flags indicates that the column
   * should be turned in to a form control
   * if it's true the key property needs
   * to be a string
   */
  control?: boolean;

  key: string | string[];
  label?: string;
  pipe?: PipeType | PipeType[];
  pipeArguments?: any | {[key: string]: any};
  sortable?: boolean;
  join?: string;
  tooltip?: string;
  nestedColumns?: NestedTableColumn[];
}

export interface NestedTableColumn extends TableColumn {
  showLabel?: boolean;
}

export interface InstanceSegment<C = any> {
  fields: string[] | any[];
  array?: string;
  type?: SegmentType;
  title?: string;
  subTitle?: string;
  description?: string;
  nestedSegments?: InstanceSegment<C>[];
  columnsDesktop?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  configuration?: C;
  classes?: string[];
  authorization?: string[];
  id?: string;
}

export interface TableSort {
  active: string;
  direction: 'desc' | 'asc';
}

export interface ModuleLayout {
  icon?: string;
  editTitleKey?: string;

  /**
   * ID of a document in the collection.
   * If added the dashboard link navigates
   * directly to the provided id.
   */
  directLink?: string;
  table?: {
    sort?: TableSort;
    tableColumns?: TableColumn[];
    hideCheckbox?: string[];
    hideAdd?: string[];
    hideEdit?: string[];
    hideDelete?: string[];
    hideExport?: string[];
    hideImport?: string[];
  };
  sortModule?: SortModule;
  filterModule?: FilterModule;
  searchModule?: SearchModule;
  instance: {
    segments: InstanceSegment[];
  };
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
  onlyOn?: InstanceSingleState;
  disableOn?: InstanceSingleState;
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
