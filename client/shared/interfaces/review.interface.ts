export interface Review {
  id: string;
  productId: string;
  customerId: string;
  orderId?: string;
  createdOn: number;
  rating: number;
  comment?: string;
}
