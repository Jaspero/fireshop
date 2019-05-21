import {SortDirection} from '@angular/material';
import {JSONSchema7} from 'json-schema';
import {SegmentType} from '../../modules/module-instance/enums/segment-type.enum';
import {PipeType} from '../enums/pipe-type.enum';
import {ComponentType} from './component-type.enum';

export interface TableColumn {
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
  key: string;
  direction: SortDirection;
}

export interface ModuleLayout {
  icon?: string;
  table?: {
    sort?: TableSort;
    tableColumns?: TableColumn[];
  };
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
}

export interface ModuleDefinitions {
  [key: string]: ModuleDefinition;
}

export interface Module {
  id: string;
  createdOn: number;
  name: string;
  description: string;
  schema: JSONSchema7;
  layout?: ModuleLayout;
  definitions?: ModuleDefinitions;
}
