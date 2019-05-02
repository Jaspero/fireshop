import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'jfs-rating-scale',
  templateUrl: './rating-scale.component.html',
  styleUrls: ['./rating-scale.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingScaleComponent),
      multi: true
    }
  ]
})
export class RatingScaleComponent implements ControlValueAccessor {
  constructor() {}

  @Input()
  value: number;

  @Input()
  color: string;

  fiveStar = new Array(5);
  onTouch: Function;
  onModelChange: Function;
  isDisabled: boolean;
  isFormControl: boolean;

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.isFormControl = isDisabled;
  }

  writeValue(value: number) {
    this.value = value;
    this.isFormControl = true;
    console.log(this.isFormControl);
  }

  chooseRating(index) {
    this.value = index + 1;
    this.onModelChange(this.value);
  }
}
