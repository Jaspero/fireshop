import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatSort} from '@angular/material';
import {UNIQUE_ID, UNIQUE_ID_PROVIDER} from '@jf/utils/id.provider';
import 'tinymce/plugins/code';
import 'tinymce/plugins/print';
import 'tinymce/plugins/wordcount';

declare const tinymce: any;

@Component({
  selector: 'jfsc-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WysiwygComponent),
      multi: true
    },
    UNIQUE_ID_PROVIDER
  ]
})
export class WysiwygComponent implements AfterViewInit, ControlValueAccessor {
  constructor(
    @Inject(UNIQUE_ID)
    public uniqueId: string,
    private cdr: ChangeDetectorRef
  ) {}
  @HostBinding('class.active')
  focused = false;

  @ViewChild('textarea', {static: true})
  textarea: ElementRef;

  editor: any;
  editorContent: string;
  onTouch: Function;
  onModelChange: Function;
  isDisabled: boolean;

  ngAfterViewInit() {
    this.registerTiny();
  }

  writeValue(value: any) {
    this.editorContent = value;
    if (this.editor) {
      this.editor.setContent(value);
    }
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    if (this.editor) {
      this.editor.getBody().setAttribute('contenteditable', !isDisabled);
    }
  }

  private registerTiny() {
    this.textarea.nativeElement.value = this.editorContent;
    tinymce.init({
      target: this.textarea.nativeElement,
      selector: '#' + this.uniqueId,
      height: 420,
      plugins: ['code', 'print', 'wordcount'],
      toolbar: [
        'undo redo',
        'insert',
        'styleselect',
        'bold italic',
        'forecolor backcolor',
        'alignleft aligncenter alignright alignjustify',
        'bullist numlist outdent indent',
        'mediaLibrary'
      ].join(' | '),
      setup: editor => {
        this.editor = editor;

        editor.on('init', () => {
          if (this.isDisabled) {
            this.editor.getBody().setAttribute('contenteditable', false);
          }
        });

        editor.on('keyup change', () => {
          const tinyContent = editor.getContent();
          this.editorContent = tinyContent;
          this.onModelChange(tinyContent);
          this.onTouch();
        });

        editor.on('focus', () => {
          this.focused = true;
          this.cdr.markForCheck();
        });

        editor.on('blur', () => {
          this.focused = false;
          this.cdr.markForCheck();
        });
      }
    });
  }
}
