import {ModuleInstanceSegment} from './module-instance-segment.interface';

export interface ModuleInstance {
  hideDuplicate?: string[];
  hideNavigation?: string[];
  segments: ModuleInstanceSegment[];
}
