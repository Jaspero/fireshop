import {AccordionComponent} from '../components/segments/accordion/accordion.component';
import {CardComponent} from '../components/segments/card/card.component';
import {EmptyComponent} from '../components/segments/empty/empty.component';
import {StepperComponent} from '../components/segments/stepper/stepper.component';
import {TabsComponent} from '../components/segments/tabs/tabs.component';
import {SegmentType} from '../enums/segment-type.enum';

export const SEGMENT_TYPE_COMPONENT_MAP = {
  [SegmentType.Empty]: EmptyComponent,
  [SegmentType.Card]: CardComponent,
  [SegmentType.Accordion]: AccordionComponent,
  [SegmentType.Tabs]: TabsComponent,
  [SegmentType.Stepper]: StepperComponent
};
