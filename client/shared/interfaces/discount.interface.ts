export interface Discount {
  id: string;
  code: string;
  name: string;
  createdOn: number;
  description: string;
  discountValue: string;
  startingDate: number;
  endingDate: number;
  type: string;
  active: boolean;
  ribbonProduct: boolean;
  limitedNumber: number;
}
