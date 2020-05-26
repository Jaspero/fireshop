import {EmailTag} from '../enums/email-tag.enum';
import {EmailTemplate} from '../interfaces/email-template.interface';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    title: 'Sign up Complete',
    id: 'new-user-signed-up',
    description: `Sent to new users when they first sign up.`,
    tags: [EmailTag.Customer]
  },
  {
    title: 'Account Deleted',
    id: 'user-deleted-account',
    description: `Sent to users when they delete their account`,
    tags: [EmailTag.Customer]
  },
  {
    title: 'Order Complete',
    id: 'order-complete',
    description: `Sent to users when they complete an order`,
    tags: [EmailTag.Customer]
  },
  {
    title: 'Checkout error',
    id: 'checkout-error',
    description: `Sent to users when their checkout failed during payment verification`,
    tags: [EmailTag.Error, EmailTag.Customer]
  },
  {
    title: 'New Sign Up Notification',
    id: 'admin-sign-up-notification',
    description: `Sent to admins when a new user signs up.`,
    tags: [EmailTag.Admin]
  },
  {
    title: 'User deleted account',
    id: 'admin-user-deleted-account-notification',
    description: `Sent to admins when a user deleted their account`,
    tags: [EmailTag.Admin]
  },
  {
    title: 'New Order Notification',
    id: 'admin-order-notification',
    description: `Sent to admins when a new order is created.`,
    tags: [EmailTag.Admin]
  },
  {
    title: 'Error Processing Payment',
    id: 'admin-checkout-failed-notification',
    description: `Sent to admins when a customer checkout fails.`,
    tags: [EmailTag.Error, EmailTag.Admin]
  },
  {
    title: 'Layout',
    id: 'layout',
    description: `Wrapper for all other templates.`,
    tags: [EmailTag.Layout]
  }
];
