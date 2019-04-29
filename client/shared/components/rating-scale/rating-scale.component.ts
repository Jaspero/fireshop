import {Component, forwardRef, OnInit} from '@angular/core';
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
export class RatingScaleComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  fiveStar = new Array(5);

  ngOnInit() {}

  registerOnChange(fn: any) {}

  registerOnTouched(fn: any) {}

  setDisabledState(isDisabled: boolean) {}

  writeValue(value: number) {}

  chooseRating(index) {
    console.log(index);
  }
}
