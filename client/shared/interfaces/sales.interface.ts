export interface Sale {
  id: number;
  name: string;
  createdOn: number;
  startingDate: any;
  endingDate: any;
  type: string;
  value: number;
  active: boolean;
  ribbonProduct: boolean;
  limitedNumber: boolean;
  fixed: boolean;
}
