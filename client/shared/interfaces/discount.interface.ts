export interface Discount {
  id: string;
  name: string;
  createdOn: number;
  description: string;
  valueType: string;
  startingDate: number;
  endingDate: number;
  type: string;
  active: boolean;
  limitedNumber: number;
  value: number;
  values: object;
}
