import {STATIC_CONFIG} from '../../environments/static-config';
import {LinkComponent} from './link/link.component';

export const ELEMENTS = [
  LinkComponent
];

export const ELEMENT_SELECTOR = [
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'link',
    component: LinkComponent
  }
];
