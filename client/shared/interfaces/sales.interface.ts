export interface Sale {
  id: string;
  name: string;
  createdOn: number;
  startingDate: Date;
  endingDate: Date;
  limited: boolean;
  value: number;
  active: boolean;
  showRibbon: boolean;
  limitedNumber: number;
  fixed: boolean;
}
