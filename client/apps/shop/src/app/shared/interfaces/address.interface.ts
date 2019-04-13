export interface Address {
  fullName: string;
  address: string;
  /**
   * Apartment number or similar
   */
  additionalAddress: string;
  city: string;
  country: string;
  postalCode: string;
  phone?: string;
  company?: string;
}
