import {Component, HostBinding, Inject, Injector, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {get} from 'json-pointer';
import {ModuleDefinitions} from '../../../../shared/interfaces/module.interface';
import {CompiledField} from '../../interfaces/compiled-field.interface';
import {CompiledSegment} from '../../pages/instance-single/instance-single.component';
import {compileSegment} from '../../utils/compile-segment';
import {SEGMENT_DATA} from '../../utils/create-segment-injector';
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
export class SegmentComponent implements OnInit {
  constructor(
    @Inject(SEGMENT_DATA) public sData: SegmentData,
    public injector: Injector
  ) {}

  segment: CompiledSegment;
  pointers: Pointers;
  nestedSegments: CompiledSegment[];
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
    this.nestedSegments = (this.sData.segment.nestedSegments || []).map(
      segment =>
        compileSegment(
          segment,
          this.sData.parser,
          this.sData.definitions,
          this.injector,
          this.segment.entryValue
        )
    );

    /**
     * Add array items if necessary
     */
    if (this.segment.array && this.segment.entryValue) {
      const values = get(this.segment.entryValue, this.segment.array);

      if (values) {
        values.forEach(() => this.addArrayItem());

        (this.pointers[this.segment.array].control as FormControl).patchValue(
          values
        );
      }
    }
  }

  addArrayItem() {
    this.sData.parser.addArrayItem(this.segment.array);

    const arrayPointers = this.pointers[this.segment.array].arrayPointers;

    this.arrayFields.push(
      Object.entries(arrayPointers[arrayPointers.length - 1]).map(
        ([key, pointer]) =>
          this.sData.parser.field(
            this.segment.array + '/' + key,
            pointer,
            this.sData.definitions
          )
      )
    );
  }

  removeArrayItem(index: number) {
    this.sData.parser.removeArrayItem(this.segment.array, index);
    this.arrayFields.splice(index, 1);
  }
}
