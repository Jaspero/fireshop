import {CurrencySettings} from '@jf/interfaces/currency-settings.interface';

/**
 * Pulled in from firebase settings collection
 */
export let DYNAMIC_CONFIG: {
  currency: CurrencySettings;
} = {
  currency: {
    primary: 'USD',
    shippingCost: 0
  }
};
