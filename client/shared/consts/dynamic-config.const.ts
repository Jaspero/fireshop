import {CurrencySettings} from '@jf/interfaces/currency-settings.interface';
import {GeneralSettings} from '@jf/interfaces/general-settings.interface';

/**
 * Pulled in from firebase settings collection
 */
export let DYNAMIC_CONFIG: {
  currency: CurrencySettings;
  generalSettings: GeneralSettings;
} = {
  currency: {
    primary: 'USD',
    shippingCost: 0
  },
  generalSettings: {
    autoReduceQuantity: true,
    inactiveForQuantity: true,
    statusUpdates: true,
    errorNotificationEmail: '',
    notifyOnShipped: true,
    notifyOnDelivered: true,
    showingQuantity: true
  }
};
