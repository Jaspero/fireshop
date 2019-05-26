import {Component, HostBinding, Inject, Injector, OnInit} from '@angular/core';
import {ModuleDefinitions} from '../../../../shared/interfaces/module.interface';
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
          this.injector
        )
    );
  }

  addArrayItem() {
    this.sData.parser.addArrayItem(this.segment.array);
    console.log('test', this.pointers);
  }

  removeArrayItem(index: number) {
    this.sData.parser.removeArrayItem(this.segment.array, index);
  }
}
