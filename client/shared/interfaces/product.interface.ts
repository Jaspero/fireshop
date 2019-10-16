export interface ProductAttribute {
  key: string;
  list: string[];
}

export type Price = {[key: string]: number};

export interface Product {
  id: string;
  category: string;
  price: Price;
  active: boolean;
  createdOn: number;
  name: string;
  shortDescription: string;
  order: number;
  description: string;
  gallery: string[];
  search: string[];
  showingQuantity: boolean;
  quantity: number;
  allowOutOfQuantityPurchase: boolean;
  relatedProducts?: string[];
  default?: string;
  attributes?: ProductAttribute[];
  inventory?: {
    [key: string]: {
      price: Price;
      quantity: number;
    };
  };
}
