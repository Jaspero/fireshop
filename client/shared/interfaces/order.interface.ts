import {OrderStatus} from '@jf/enums/order-status.enum';
import {Address} from './address.interface';

export interface OrderPrice {
  total: number;
  shipping?: number;
  subTotal: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
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
  email: string;
  customerId?: string;
  customerName?: string;
  error?: string;
}

export interface Errors {
  data: {id: string; name: string; quantity: number};
  message: string;
  type: string;
}
