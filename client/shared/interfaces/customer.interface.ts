import {Address} from '@jf/interfaces/address.interface';

export interface CustomerWishList {
  name: string;
  addedOn: number;
}

export interface Customer {
  id: string;
  createdOn: number;
  name?: string;
  profileImage?: string;
  billing?: Address;
  shippingInfo?: boolean;
  shipping?: Address;

  /**
   * wishList is a list of product ids
   * matching a wishListSnippets that
   * are a list of product snippets
   */
  wishList?: string[];
  wishListSnippets?: CustomerWishList[];
}
