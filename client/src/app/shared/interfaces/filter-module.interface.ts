import {MatDialogConfig} from '@angular/material/dialog';
import {JSONSchema7} from 'json-schema';
import {FilterMethod} from '../enums/filter-method.enum';
import {ModuleInstanceSegment} from './module-instance-segment.interface';
import {ModuleDefinition} from './module.interface';

export interface FilterModuleDefinition extends ModuleDefinition {
  filterMethod?: FilterMethod;
  filterLabel?: string;
}

export interface FilterModuleDefinitions {
  [key: string]: FilterModuleDefinition;
}

export interface FilterModule {
  schema: JSONSchema7;

  /**
   * Method for formatting the WhereFilter[] before
   * forwarding it to the filter handler
   */
  formatOnSubmit?: string;
  value?: any;
  definitions?: FilterModuleDefinitions;
  segments?: ModuleInstanceSegment[];
  clearFilters?: any;
  clearFiltersLabel?: string;
  dialogOptions?: Partial<MatDialogConfig>;
}
