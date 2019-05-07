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

export interface CustomerWishList {
  productId: string;
  name: string;
  addedOn: number;
}

export interface Customer {
  id: string;
  createdOn: number;
  name?: string;
  profileImage?: string;
  billing?: Address;
  shippingInfo?: boolean;
  shipping?: Address;
  wishList?: CustomerWishList[];
  orders?: Order[];
  reviews?: CustomerReview[];
}
