import {Validators} from '@angular/forms';

export function getProductFilters(product, formControl = true) {
  const defaults = product.default.split('_');

  return product.attributes.reduce((acc, cur, index) => {
    const value = defaults[index] || '';

    acc[cur.key] = formControl ? [value, Validators.required] : value;

    return acc;
  }, {});
}
