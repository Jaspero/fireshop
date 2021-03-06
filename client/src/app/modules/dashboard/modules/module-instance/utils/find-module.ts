import {Module} from '../../../../../shared/interfaces/module.interface';

export function findModule(
  modules: Module[],
  query: {
    id?: string;
    collectionId?: string;
    documentId?: string;
    subCollectionId?: string;
  }
) {
  if (query.id) {
    return modules.find(mod => mod.id === query.id);
  } else {
    return modules.find(mod => {
      const [collection, document, subCollection] = mod.id.split('/');

      if  (!subCollection) {
        return;
      }

      return collection === query.collectionId &&
        subCollection === query.subCollectionId;
    })
  }
}
