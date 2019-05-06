import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'jfsc-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  search: FormControl;
  onTouch: Function;
  onModelChange: Function;

  ngOnInit() {
    this.search = new FormControl('');
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  setDisabledState(isDisabled: boolean) {}

  writeValue(value: string) {
    this.search.setValue(value);
  }

  clearInput() {
    if (this.search.value !== '') {
      this.search.setValue('');
    }
  }
}
