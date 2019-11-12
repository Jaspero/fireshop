import {JSONSchema7} from 'json-schema';
import {FilterMethod} from '../enums/filter-method.enum';
import {InstanceSegment, ModuleDefinition, ModuleDefinitions} from './module.interface';

export interface FilterModuleDefinition extends ModuleDefinition {
  filterMethod?: FilterMethod;
}

export interface FilterModuleDefinitions {
  [key: string]: FilterModuleDefinition;
}

export interface FilterModule {
  schema: JSONSchema7;
  value?: any;
  definitions?: FilterModuleDefinitions;
  segments?: InstanceSegment[];
  clearFilters?: any;
  clearFiltersLabel?: string;
}
