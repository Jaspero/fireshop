import {take} from 'rxjs/operators';
import {ElementType} from '../enums/element-type.enum';
import {BaseElement} from './base-element.class';

export class CardElement extends BaseElement {
  type: ElementType.Card;

  afterMount() {
    this.element.on('change', event => {
      const toSet = !event.error;

      let current: boolean;

      this.isValid$.pipe(take(1)).subscribe(value => {
        current = value;
      });

      if (toSet !== current) {
        this.isValid$.next(toSet);
      }
    });
  }
}
