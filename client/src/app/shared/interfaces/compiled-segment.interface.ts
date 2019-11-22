import {ComponentPortal} from '@angular/cdk/portal';
import {SegmentComponent} from '../../modules/module-instance/components/segment/segment.component';
import {CompiledField} from '../../modules/module-instance/interfaces/compiled-field.interface';
import {ModuleInstanceSegment} from './module-instance-segment.interface';

export interface CompiledSegment<T = any> extends ModuleInstanceSegment<T> {
  classes: string[];
  fields: CompiledField[] | string[];
  component?: ComponentPortal<SegmentComponent>;
  nestedSegments?: CompiledSegment<T>[];
  entryValue: any;
}
