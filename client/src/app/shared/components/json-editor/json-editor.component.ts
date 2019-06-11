import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import JSONEditor from 'jsoneditor';

@Component({
  selector: 'jms-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonEditorComponent),
      multi: true
    }
  ]
})
export class JsonEditorComponent
  implements AfterViewInit, ControlValueAccessor {
  constructor() {}

  @ViewChild('editor', {static: true})
  editorEl: ElementRef<HTMLElement>;

  @Input()
  height = 500;

  @Input()
  options: any;

  editor: JSONEditor;
  setValue: any;

  onChange = (_: any) => {};
  onTouch = () => {};

  ngAfterViewInit() {
    let touched = false;

    this.editor = new JSONEditor(this.editorEl.nativeElement, {
      mode: 'code',
      modes: ['tree', 'code', 'view', 'text'],
      onChange: () => {
        if (!touched) {
          touched = true;
          this.onTouch();
        }

        let value;

        try {
          value = this.editor.get();
        } catch (e) {}

        if (value) {
          this.onChange(value);
        }
      },
      ...this.options
    });

    if (this.setValue) {
      this.editor.set(this.setValue);
    }
  }

  writeValue(value: any) {
    if (this.editor) {
      this.editor.set(value);
    } else {
      this.setValue = value;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }
}
