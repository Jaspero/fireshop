import {Address} from '@jf/interfaces/address.interface';
import {Order} from '@jf/interfaces/order.interface';

export interface CustomerReview {
  productId: string;
  review: {
    title: string;
    snippet: string;
    rating: number;
  };
  createdOn: number;
}

export interface CustomerAddress extends Address {
  primary: boolean;
}

export interface Customer {
  wishList?: string[];
  orders?: Order[];
  reviews?: CustomerReview[];
  addresses?: CustomerAddress[];
  stripeId?: string;
  createdOn?: number;
}
