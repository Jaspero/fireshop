import {ComponentPortal} from '@angular/cdk/portal';
import {Injector} from '@angular/core';
import {ViewState} from '../../../shared/enums/view-state.enum';
import {CompiledSegment} from '../../../shared/interfaces/compiled-segment.interface';
import {
  CompiledCondition,
  ConditionAction,
  ConditionEvaluate,
  ConditionType
} from '../../../shared/interfaces/condition.interface';
import {ModuleInstanceSegment} from '../../../shared/interfaces/module-instance-segment.interface';
import {ModuleDefinitions} from '../../../shared/interfaces/module.interface';
import {SegmentComponent} from '../components/segment/segment.component';
import {SEGMENT_TYPE_COMPONENT_MAP} from '../consts/segment-type-component-map.const';
import {SegmentType} from '../enums/segment-type.enum';
import {CompiledField} from '../interfaces/compiled-field.interface';
import {createSegmentInjector} from './create-segment-injector';
import {Parser} from './parser';
import {safeEval} from './safe-eval';

export function compileSegment(
  segment: ModuleInstanceSegment,
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

  /**
   * TODO:
   * Statement support
   */
  if (segment.conditions) {

    compiledSegment.conditions = [];
    const valToPass = entryValue || {};

    for (const cur of segment.conditions) {
      let condition;

      const type = cur.type || ConditionType.Function;
      const action = cur.action || ConditionAction.Show;
      const evaluateOn = cur.evaluateOn || ConditionEvaluate.OnLoad;
      const evaluateStates = cur.evaluateStates || [
        ViewState.New,
        ViewState.Edit,
        ViewState.Copy,
      ];

      if (cur.condition) {
        condition = safeEval(cur.condition as string);
      }

      if (condition) {

        /**
         * Evaluate on load conditions
         */
        if (evaluateOn === ConditionEvaluate.OnLoad) {

          /**
           * Check if items should be excluded right away
           */
          if (
            (action === ConditionAction.Show && !condition(valToPass)) ||
            (action === ConditionAction.Hide && condition(valToPass))
          ) {
            return null;
          }
        }

        compiledSegment.conditions.push({
          condition,
          type,
          action,
          evaluateStates,
          evaluateOn,
          ...cur.data && {
            data: cur.data
          }
        } as CompiledCondition);
      }
    }
  }

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
