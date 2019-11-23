import {STATIC_CONFIG} from '../../environments/static-config';
import {LinkComponent} from './link/link.component';
import {TableComponent} from './table/table.component';

export const ELEMENTS = [
  LinkComponent,
  TableComponent
];

export const ELEMENT_SELECTOR = [
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'link',
    component: LinkComponent
  },
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'table',
    component: TableComponent
  }
];
