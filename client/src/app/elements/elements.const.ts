import {STATIC_CONFIG} from '../../environments/static-config';
import {LinkComponent} from './link/link.component';
import {TableComponent} from './table/table.component';
import {TriggerPasswordResetComponent} from './trigger-password-reset/trigger-password-reset.component';
import {UserAddComponent} from './user-add/user-add.component';

export const ELEMENTS = [
  LinkComponent,
  TableComponent,
  TriggerPasswordResetComponent,
  UserAddComponent
];

export const ELEMENT_SELECTOR = [
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'link',
    component: LinkComponent
  },
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'table',
    component: TableComponent
  },
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'tpr',
    component: TriggerPasswordResetComponent
  },
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'user-add',
    component: UserAddComponent
  }
];
