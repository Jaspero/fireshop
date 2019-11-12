import {FilterMethod} from '../enums/filter-method.enum';

export interface WhereFilter {
  key: string;
  operator: FilterMethod;
  value: any;
}
