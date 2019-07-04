import {JSONSchema7} from 'json-schema';
import {InstanceSingleState} from '../../modules/module-instance/enums/instance-single-state.enum';
import {SegmentType} from '../../modules/module-instance/enums/segment-type.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {ComponentType} from './component-type.enum';
import OrderByDirection = firebase.firestore.OrderByDirection;

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
  pipe?: PipeType;
  pipeArguments?: any[];
  sortable?: boolean;
  join?: string;
  nestedColumns?: NestedTableColumn[];
}

export interface NestedTableColumn extends TableColumn {
  showLabel?: boolean;
}

export interface InstanceSegment {
  fields: string[] | any[];
  array?: string;
  type?: SegmentType;
  title?: string;
  subTitle?: string;
  description?: string;
  nestedSegments?: InstanceSegment[];
  columnsDesktop?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  configuration?: any;
  classes?: string[];
  id?: string;
}

export interface TableSort {
  active: string;
  direction: OrderByDirection;
}

export interface SortModule {
  sortKey: string;
  sortTitle: string;
  sortSubTitle: string;
}

export interface ModuleLayout {
  icon?: string;
  editTitleKey?: string;
  table?: {
    sort?: TableSort;
    tableColumns?: TableColumn[];
  };
  sortModule?: SortModule;
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
}
