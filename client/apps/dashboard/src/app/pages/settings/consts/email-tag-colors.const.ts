import {EmailTag} from '../enums/email-tag.enum';

export const EMAIL_TAG_COLORS = {
  [EmailTag.Error]: 'warn',
  [EmailTag.Customer]: 'primary',
  [EmailTag.Admin]: 'accent',
  [EmailTag.Layout]: 'default'
};
