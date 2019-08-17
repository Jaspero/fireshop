import * as admin from 'firebase-admin';
import {setServerState} from '../utils/set-server-state';

export const PAGE_SUFFIX = ' - Jaspero Fireshop';
export const PAGE_PREFIX = '';

export interface PageData {
  name: string;
  match: RegExp;
  operation?: (capture: string[], document) => Promise<void>;
  meta?: {[key: string]: string};
}

export async function loadItem(
  document,
  collection: string,
  id: string,
  titleKey: string,
  meta?: (item: any) => {[key: string]: string},
  stateKey?: string
) {
  // TODO: Language
  const item = await admin
    .firestore()
    .collection(collection)
    .doc(id)
    .get();

  if (!item.exists) {
    throw new Error('Item missing');
  }

  const data = item.data();

  // TODO: Structured data
  document.title = PAGE_PREFIX + data[titleKey] + PAGE_SUFFIX;

  let metaSet: any = DEFAULT_META;

  if (meta) {
    metaSet = meta(data);
  }

  Object.entries(metaSet).forEach(([key, value]) => {
    document.querySelector(`meta[name=${key}]`).content = value;
  });

  if (stateKey) {
    setServerState({[stateKey]: data}, document);
  }
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
    operation: (capture, document) => {
      return loadItem(
        document,
        'products-en',
        capture[1],
        'name',
        item => ({
          description: item.shortDescription
        }),
        'product'
      );
    }
  }
];

export const DEFAULT_META = {
  description: 'A modern pwa webshop built on Firebase with Angular',
  keywords: 'e-commerce,angular,firebase,pwa'
};
