import * as admin from 'firebase-admin';

export const PAGE_SUFFIX = ' - Jaspero Fireshop';
export const PAGE_PREFIX = '';

export interface PageData {
  name: string;
  match: RegExp;
  operation?: (capture: string[], document) => Promise<void>;
  meta?: {[key: string]: string}
}

export const PAGES: PageData[] = [
  {
    name: 'Home',
    match: /^\/?$/i,
    meta: {
      description: 'A modern pwa webshop built on Firebase with Angular',
      keywords: 'e-commerce,angular,firebase,pwa'
    }
  },
  {
    name: 'Shop',
    match: /^\/shop\/?$/i,
    meta: {
      description: 'ListComponent of the products in our shop'
    }
  },
  {
    name: 'Product',
    match: /^\/product\/(?:([^\/]+?))\/?$/i,
    operation: async (capture, document) => {
      // TODO: Language
      const product = await admin
        .firestore()
        .collection('products-en')
        .doc(capture[1])
        .get();

      if (!product.exists) {
        throw new Error('Product missing');
      }

      const data = product.data();

      // TODO: Structured data and sending state to client
      document.title = data.name;
      document.querySelector(`meta[name=description]`).content = data.shortDescription;
    }
  }
];

export const DEFAULT_META = {
  description: 'A modern pwa webshop built on Firebase with Angular',
  keywords: 'e-commerce,angular,firebase,pwa'
};