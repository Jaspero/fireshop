import {AbstractControl} from '@angular/forms';

export function RepeatPasswordValidator(errorMsg: string) {
  return (control: AbstractControl) => {
    return control.value.password === control.value.repeatPassword
      ? null
      : {equal: errorMsg};
  };
}
