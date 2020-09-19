import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'jms-search-input',
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
export class SearchInputComponent
  implements OnInit, AfterViewInit, ControlValueAccessor {
  constructor() {}

  @Input()
  debounceTime = 400;

  search: FormControl;
  onTouch: any;
  onModelChange: any;
  isDisabled: boolean;

  ngOnInit() {
    this.search = new FormControl('');
  }

  ngAfterViewInit() {
    this.search.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe(value => {
        this.onModelChange(value);
      });
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  writeValue(value: string) {
    this.search.setValue(value);
  }

  clearInput() {
    if (this.search.value !== '') {
      this.search.setValue('');
    }
  }
}
