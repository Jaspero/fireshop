import {SegmentType} from '../../modules/module-instance/enums/segment-type.enum';

export interface ModuleInstanceSegment<C = any> {
  fields: string[] | any[];
  array?: string;
  type?: SegmentType;
  title?: string;
  subTitle?: string;
  description?: string;
  nestedSegments?: ModuleInstanceSegment<C>[];
  columnsDesktop?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  configuration?: C;
  classes?: string[];
  authorization?: string[];
  id?: string;
}
