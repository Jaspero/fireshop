import {Component, HostBinding, Inject, Injector, OnInit} from '@angular/core';
import {ModuleDefinitions} from '../../../../shared/interfaces/module.interface';
import {CompiledSegment} from '../../pages/instance-single/instance-single.component';
import {compileSegment} from '../../utils/compile-segment';
import {SEGMENT_DATA} from '../../utils/create-segment-injector';
import {Parser} from '../../utils/parser';

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
  nestedSegments: CompiledSegment[];

  @HostBinding('class')
  classes: string;

  ngOnInit() {
    this.segment = this.sData.segment;
    this.classes = this.sData.segment.classes.join(' ');

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
}
