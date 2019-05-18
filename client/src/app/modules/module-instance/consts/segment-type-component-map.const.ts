import {SegmentType} from '../enums/segment-type.enum';
import {CardComponent} from '../components/segments/card/card.component';
import {EmptyComponent} from '../components/segments/empty/empty.component';

export const SEGMENT_TYPE_COMPONENT_MAP = {
  [SegmentType.Empty]: EmptyComponent,
  [SegmentType.Card]: CardComponent
};
