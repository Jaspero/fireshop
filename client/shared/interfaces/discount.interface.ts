export interface Discount {
  id: string;
  name: string;
  description: string;
  discountValue: string;
  startingDate: number;
  endingDate: number;
  type: string;
  active: boolean;
  ribbonProduct: boolean;
  limitedNumber: number;
}
