export interface Sales {
  id: number;
  name: string;
  createdOn: number;
  startingDate: Date;
  endingDate: Date;
  type: string;
  value: number;
  active: boolean;
  ribbonProduct: boolean;
  limitedNumber: boolean;
  saleValueType: string;
}
