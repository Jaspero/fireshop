export interface Sale {
  id: number;
  name: string;
  createdOn: number;
  startingDate: number;
  endingDate: number;
  limited: boolean;
  value: number;
  active: boolean;
  showRibbon: boolean;
  limitedNumber: number;
  fixed: boolean;
}
