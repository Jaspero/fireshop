import {Component, HostBinding, Inject, Injector, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {get} from 'json-pointer';
import {CompiledSegment} from '../../../../shared/interfaces/compiled-segment.interface';
import {ModuleDefinitions} from '../../../../shared/interfaces/module.interface';
import {StateService} from '../../../../shared/services/state/state.service';
import {CompiledField} from '../../interfaces/compiled-field.interface';
import {SEGMENT_DATA} from '../../utils/create-segment-injector';
import {filterAndCompileSegments} from '../../utils/filter-and-compile-segments';
import {Parser, Pointers} from '../../utils/parser';

export interface SegmentData {
  segment: CompiledSegment;
  parser: Parser;
  definitions: ModuleDefinitions;
}

@Component({
  selector: 'jms-segment',
  template: ''
})
export class SegmentComponent<T = any> implements OnInit {
  constructor(
    @Inject(SEGMENT_DATA) public sData: SegmentData,
    public injector: Injector,
    public state: StateService
  ) {}

  segment: CompiledSegment<T>;
  pointers: Pointers;
  nestedSegments: CompiledSegment<T>[];
  arrayFields: Array<CompiledField[]> = [];

  @HostBinding('class')
  classes: string;

  @HostBinding('id')
  id: string;

  ngOnInit() {
    this.segment = this.sData.segment;
    this.classes = this.sData.segment.classes.join(' ');
    this.pointers = this.sData.parser.pointers;
    this.id = this.sData.segment.id || '';

    /**
     * Each segment compiles all nested segments
     */
    this.nestedSegments = filterAndCompileSegments(
      this.state.role,
      this.sData.segment.nestedSegments || [],
      this.sData.parser,
      this.sData.definitions,
      this.injector,
      this.segment.entryValue
    );

    /**
     * Add array items if necessary
     */
    if (this.segment.array && this.segment.entryValue) {
      const values = get(this.segment.entryValue, this.segment.array);

      if (values) {
        values.forEach(() => this.addArrayItem(false));

        (this.pointers[this.segment.array].control as FormControl).patchValue(
          values
        );

        for (let i = 0; i < values.length; i++) {
          this.sData.parser.loadHooks(this.pointers[this.segment.array].arrayPointers[i]);
        }
      }
    }
  }

  addArrayItem(loadHook = true) {
    this.sData.parser.addArrayItem(this.segment.array, loadHook);

    const arrayPointers = this.pointers[this.segment.array].arrayPointers;

    this.arrayFields.push(
      Object.entries(arrayPointers[arrayPointers.length - 1])
        .map(
          ([key, pointer]) =>
            this.sData.parser.field(
              key,
              pointer,
              this.sData.definitions,
              true,
              this.segment.array
            )
        )
        .sort((a, b) => {
          const originalIndexA = (this.segment.fields || []).findIndex(fi => fi === a.pointer);
          const originalIndexB = (this.segment.fields || []).findIndex(fi => fi === b.pointer);

          return originalIndexA - originalIndexB;
        })
    );
  }

  removeArrayItem(index: number) {
    this.sData.parser.removeArrayItem(this.segment.array, index);
    this.arrayFields.splice(index, 1);
  }
}
