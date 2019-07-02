import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';
import 'tinymce/plugins/code';
import 'tinymce/plugins/print';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/link';

declare const tinymce: any;

@Component({
  selector: 'jms-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WysiwygComponent extends FieldComponent<FieldData>
  implements AfterViewInit {
  @ViewChild('textarea', {static: true})
  textarea: ElementRef;

  editor: any;

  ngAfterViewInit() {
    this.registerTiny();
  }

  private registerTiny() {
    tinymce.init({
      target: this.textarea.nativeElement,
      height: 420,
      plugins: ['code', 'print', 'wordcount', 'link'],

      /**
       * Link settings
       */
      default_link_target: '_blank',

      toolbar: [
        'undo redo',
        'insert',
        'styleselect',
        'bold italic',
        'forecolor backcolor',
        'alignleft aligncenter alignright alignjustify',
        'bullist numlist outdent indent',
        'link',
        'mediaLibrary'
      ].join(' | '),
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', () => {
          const tinyContent = editor.getContent();
          this.cData.control.setValue(tinyContent);
        });
      }
    });
  }
}
