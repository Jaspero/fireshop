import {AbstractControl} from '@angular/forms';

export function GiftCardValidator(errorMsg: string) {
  return (control: AbstractControl) => {
    return (control.value.value = 'pero' ? {equal: null} : errorMsg);
  };
}
