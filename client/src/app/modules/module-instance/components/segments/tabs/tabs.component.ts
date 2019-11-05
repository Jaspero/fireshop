import {ChangeDetectionStrategy, Component, Inject, Injector, OnInit} from '@angular/core';
import {CompiledSegment} from '../../../../../shared/interfaces/compiled-segment.interface';
import {SegmentComponent, SegmentData} from '../../segment/segment.component';
import {InstanceSegment} from '../../../../../shared/interfaces/module.interface';
import {CompiledField} from '../../../interfaces/compiled-field.interface';
import {SEGMENT_DATA} from '../../../utils/create-segment-injector';
import {compileSegment} from '../../../utils/compile-segment';

interface SegmentTab {
  title?: string;
  fields?: string[];
  nestedSegments?: InstanceSegment[];
}

interface CompiledSegmentTab {
  title?: string;
  fields?: CompiledField[];
  nestedSegments?: CompiledSegment[];
}

@Component({
  selector: 'jms-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent extends SegmentComponent implements OnInit {
  constructor(
    @Inject(SEGMENT_DATA) public sData: SegmentData,
    public injector: Injector
  ) {
    super(sData, injector);
  }

  tabs: CompiledSegmentTab[];

  ngOnInit() {
    super.ngOnInit();

    this.tabs = (this.sData.segment.configuration || []).map(
      (tab: SegmentTab) => ({
        title: tab.title,
        fields: (tab.fields || []).map(key =>
          this.sData.parser.field(
            key,
            this.pointers[key],
            this.sData.definitions
          )
        ),
        nestedSegments: (tab.nestedSegments || []).map(segment =>
          compileSegment(
            segment,
            this.sData.parser,
            this.sData.definitions,
            this.injector,
            this.segment.entryValue
          )
        )
      })
    );
  }
}

