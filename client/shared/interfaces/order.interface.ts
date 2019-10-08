import {OrderStatus} from '@jf/enums/order-status.enum';
import {Price} from '@jf/interfaces/product.interface';
import {Address} from './address.interface';

export interface OrderPrice {
  total: number;
  shipping?: number;
  subTotal: number;
}

export interface OrderItem {
  quantity: number;
  name: string;
  price: Price;
  attributes: any;
  identifier: string;
}

export interface Order {
  id: string;
  paymentIntentId: string;
  status: OrderStatus;
  price: OrderPrice;
  billing: Address;
  shipping?: Address;
  createdOn: number;
  orderItems: string[];
  orderItemsData: OrderItem[];
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
