import {OrderStatus} from '@jf/enums/order-status.enum';
import {Address} from './address.interface';

export interface OrderPrice {
  total: number;
  subTotal: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  /**
   * Any attributes that can differ
   */
  attributes: any;
}

export interface Order {
  id: string;
  paymentIntentId: string;
  status: OrderStatus;
  price: OrderPrice;
  billing: Address;
  shipping?: Address;
  createdOn: number;
  orderItems: OrderItem[];
  customerId?: string;
  customerName?: string;
}
