import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl} from '@angular/forms';

@Component({
  selector: 'jfsc-search-list',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
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

  clearInput() {
    if (this.search.value !== '') {
      this.search.setValue('');
    }
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
}
