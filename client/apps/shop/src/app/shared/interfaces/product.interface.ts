import {Size} from '../enums/size.enum';
import {Color} from '../enums/color.enum';

export interface Product {
  id: string;
  category: string;
  price: number;
  active: boolean;
  createdOn: number;
  name: string;
  shortDescription: string;
  description: string;
  gallery: string[];
  attributes?: {
    size?: {
      value: Size[];
      default: Size;
    };
    color?: {
      value: Color[];
      default: Color;
    };
  };
}
