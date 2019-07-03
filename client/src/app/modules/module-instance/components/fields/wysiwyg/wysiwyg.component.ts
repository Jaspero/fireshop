import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {filter} from 'rxjs/operators';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
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
  implements OnInit, AfterViewInit {
  constructor(
    @Inject(COMPONENT_DATA) public cData: FieldData,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    super(cData);
  }

  @ViewChild('textarea', {static: true})
  textarea: ElementRef;

  @ViewChild('youTubeDialog', {static: true})
  youTubeDialogTemplate: TemplateRef<any>;

  editor: any;
  ytForm: FormGroup;
  ytDefault = {
    fullWidth: true,
    showPlayerControls: true,
    privacyEnhancedMode: false,
    align: 'left'
  };

  ngOnInit() {
    this.ytForm = this.fb.group({
      value: ['', Validators.required],
      ...this.ytDefault
    });
  }

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
        'mediaLibrary',
        'youTube'
      ].join(' | '),
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', () => {
          const tinyContent = editor.getContent();
          this.cData.control.setValue(tinyContent);
        });

        editor.ui.registry.addButton('youTube', {
          type: 'button',
          icon: 'image',
          tooltip: 'Embed youtube video',
          onAction: () => {
            this.ytForm.reset(this.ytDefault);
            this.dialog
              .open(this.youTubeDialogTemplate, {width: '500px'})
              .afterClosed()
              .pipe(filter(value => !!value))
              .subscribe(() => {
                const data = this.ytForm.getRawValue();
                let url = data.privacyEnhancedMode
                  ? 'https://www.youtube-nocookie.com/embed/'
                  : 'https://www.youtube.com/embed/';

                url = url + data.value;

                if (!data.showPlayerControls) {
                  data.value += '?controls=0';
                }

                const iframe = `<iframe width="560" height="315" src="${url}" frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

                editor.insertContent(
                  data.fullWidth
                    ? `<div class="evw-full" style="text-align: ${data.align}">${iframe}</div>`
                    : `<div style="text-align: ${data.align}">${iframe}</div>`
                );
              });
          }
        });
      }
    });
  }
}
