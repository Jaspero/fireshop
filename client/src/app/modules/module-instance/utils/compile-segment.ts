import {ComponentPortal} from '@angular/cdk/portal';
import {Injector} from '@angular/core';
import {SegmentType} from '../enums/segment-type.enum';
import {
  InstanceSegment,
  ModuleDefinitions
} from '../../../shared/interfaces/module.interface';
import {SegmentComponent} from '../components/segment/segment.component';
import {SEGMENT_TYPE_COMPONENT_MAP} from '../consts/segment-type-component-map.const';
import {CompiledField} from '../interfaces/compiled-field.interface';
import {CompiledSegment} from '../pages/instance-single/instance-single.component';
import {createSegmentInjector} from './create-segment-injector';
import {Parser} from './parser';

export function compileSegment(
  segment: InstanceSegment,
  parser: Parser,
  definitions: ModuleDefinitions,
  injector: Injector,
  entryValue: any
) {
  const classes = [];

  let fields: CompiledField[] | string[] = [];

  if (segment.columnsDesktop) {
    classes.push(`col-${segment.columnsDesktop}`);
  }

  if (segment.columnsTablet) {
    classes.push(`col-m-${segment.columnsTablet}`);
  }

  if (segment.columnsMobile) {
    classes.push(`col-s-${segment.columnsMobile}`);
  }

  /**
   * If there aren't any column definitions
   * default to full width
   */
  if (!classes.length) {
    classes.push('col-12');
  }

  if (segment.classes) {
    classes.push(...segment.classes);
  }

  if (segment.fields) {

    /**
     * If it's an array fields are parsed
     */
    fields = segment.array ? (segment.fields || []).map(fi => segment.array + fi) : (segment.fields || []).map(key =>
      parser.field(key, parser.pointers[key], definitions)
    );
  }

  const compiledSegment = {
    ...segment,
    classes,
    fields,
    entryValue
  } as CompiledSegment;

  return {
    component: new ComponentPortal<SegmentComponent>(
      SEGMENT_TYPE_COMPONENT_MAP[segment.type || SegmentType.Card],
      null,
      createSegmentInjector(injector, {
        segment: compiledSegment,
        parser,
        definitions
      })
    ),
    ...compiledSegment
  } as CompiledSegment;
}
