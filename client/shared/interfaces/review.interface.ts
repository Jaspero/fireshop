export interface Review {
  id?: string;
  productId?: string;
  customerId?: string;
  customerName?: string;
  orderId?: string;
  createdOn?: number;
  rating?: number;
  comment?: string;
}
