import {AbstractControl} from '@angular/forms';
import {StateService} from '../../apps/shop/src/app/shared/services/state/state.service';

export class ValidateEmailNotTaken {
  static createValidator(stateService: StateService) {
    return (control: AbstractControl) => {
      return stateService.giftCardId(control.value).map(res => {
        return res ? {giftCard: true} : null;
      });
    };
  }
}
