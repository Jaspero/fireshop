import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CompiledSegment} from '../../../../../shared/interfaces/compiled-segment.interface';
import {InstanceSegment} from '../../../../../shared/interfaces/module.interface';
import {CompiledField} from '../../../interfaces/compiled-field.interface';
import {filterAndCompileSegments} from '../../../utils/filter-and-compile-segments';
import {SegmentComponent} from '../../segment/segment.component';

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
        nestedSegments: filterAndCompileSegments(
          this.state.role,
          tab.nestedSegments || [],
          this.sData.parser,
          this.sData.definitions,
          this.injector,
          this.segment.entryValue
        )
      })
    );
  }
}

