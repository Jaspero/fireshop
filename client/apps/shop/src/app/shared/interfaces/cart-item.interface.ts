import {Price} from '@jf/interfaces/product.interface';

export interface CartItem {
  identifier: string;
  name: string;
  price: Price;
  productId: string;
  image: string;
  quantity: number;
  maxQuantity: number;
  allowOutOfQuantityPurchase?: boolean;
  filters?: any;
}
