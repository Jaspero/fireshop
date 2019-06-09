import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';

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
    console.log(this.cData);
    this.registerTiny();
  }

  private registerTiny() {
    tinymce.init({
      selector: 'textarea',
      target: this.textarea.nativeElement,
      height: 420,
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
        editor.on('keyup change', () => {
          const tinyContent = editor.getContent();
          this.cData.control.setValue(tinyContent);
        });
      }
    });
  }
}
