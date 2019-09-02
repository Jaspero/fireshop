import {EmailTag} from '../enums/email-tag.enum';

export interface EmailTemplate {
  title: string;
  id: string;
  description: string;
  tags: EmailTag[];
}
