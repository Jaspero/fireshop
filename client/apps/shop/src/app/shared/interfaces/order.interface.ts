export interface OrderItem {
  productId: string;
  quantity: number;
  /**
   * Any attributes that can differ
   */
  attributes: any;
}

export interface Order {
  customer: string;
  items: OrderItem[];
  status: string;
  createdOn: string;
}
