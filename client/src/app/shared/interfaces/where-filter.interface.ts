import {FilterMethod} from '../enums/filter-method.enum';

export interface WhereFilter {
  key: string;
  operator: FilterMethod;
  value: any;
  label?: string;

  /**
   * filters that are flagged to persists
   * will be added to the query parameters
   */
  persist?: boolean;
}
