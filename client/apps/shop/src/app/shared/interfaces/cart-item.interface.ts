export interface CartItem {
  identifier: string;
  name: string;
  price: number;
  productId: string;
  image: string;
  quantity: number;
  maxQuantity: number;
  filters?: any;
}
