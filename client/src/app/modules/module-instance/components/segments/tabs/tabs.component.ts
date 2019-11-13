import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {CompiledSegment} from '../../../../../shared/interfaces/compiled-segment.interface';
import {InstanceSegment} from '../../../../../shared/interfaces/module.interface';
import {CompiledField} from '../../../interfaces/compiled-field.interface';
import {filterAndCompileSegments} from '../../../utils/filter-and-compile-segments';
import {safeEval} from '../../../utils/safe-eval';
import {SegmentComponent, SegmentData} from '../../segment/segment.component';

type SelectedTabChange = (event: MatTabChangeEvent, sData: SegmentData) => void;

interface TabsConfiguration {
  selectedIndex?: number;
  dynamicHeight?: boolean;
  disableRipple?: boolean;
  selectedTabChange?: string | SelectedTabChange;
  tabs: SegmentTab[];
}

interface SegmentTabShared {
  title?: string;
  disabled?: boolean;
}

interface SegmentTab extends SegmentTabShared {
  fields?: string[];
  nestedSegments?: InstanceSegment[];
}

interface CompiledSegmentTab extends SegmentTabShared {
  fields?: CompiledField[];
  nestedSegments?: CompiledSegment[];
}

@Component({
  selector: 'jms-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent extends SegmentComponent<TabsConfiguration> implements OnInit {

  tabs: CompiledSegmentTab[];
  selectedTabChange?: SelectedTabChange;

  ngOnInit() {
    super.ngOnInit();

    if (this.segment.configuration.selectedTabChange) {
      this.selectedTabChange = safeEval(
        this.segment.configuration.selectedTabChange as string
      );
    }

    this.tabs = this.segment.configuration.tabs.map(
      tab => ({
        ...tab,
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

  tabChange(event: MatTabChangeEvent) {
    if (this.selectedTabChange) {
      this.selectedTabChange(
        event,
        this.sData
      );
    }
  }
}

