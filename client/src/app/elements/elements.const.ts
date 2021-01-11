import {STATIC_CONFIG} from '../../environments/static-config';
import {ChangeEmailComponent} from './change-email/change-email.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {LinkComponent} from './link/link.component';
import {TableComponent} from './table/table.component';
import {ToggleUserStatusComponent} from './toggle-user-status/toggle-user-status.component';
import {TriggerPasswordResetComponent} from './trigger-password-reset/trigger-password-reset.component';
import {UserAddComponent} from './user-add/user-add.component';

export const ELEMENTS = [
  LinkComponent,
  TableComponent,
  TriggerPasswordResetComponent,
  UserAddComponent,
  ChangePasswordComponent,
  ToggleUserStatusComponent,
  ChangeEmailComponent
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
  },
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'cp',
    component: ChangePasswordComponent
  },
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'tus',
    component: ToggleUserStatusComponent
  },
  {
    selector: STATIC_CONFIG.elementSelectorPrefix + 'ce',
    component: ChangeEmailComponent
  }
];
