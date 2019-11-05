import {JSONSchema7} from 'json-schema';
import {InstanceSegment, ModuleDefinitions} from './module.interface';

export interface FilterModule {
  schema: JSONSchema7;
  value?: any;
  definitions?: ModuleDefinitions;
  segments?: InstanceSegment[];
}
