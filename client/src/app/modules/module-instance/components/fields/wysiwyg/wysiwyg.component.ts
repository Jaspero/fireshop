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
import {AngularFireStorage} from '@angular/fire/storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {filter, take} from 'rxjs/operators';
import {FieldData} from '../../../interfaces/field-data.interface';
import {ModuleInstanceComponent} from '../../../module-instance.component';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {FieldComponent} from '../../field/field.component';
import 'tinymce/plugins/code';
import 'tinymce/plugins/print';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/fullscreen';

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
    private dialog: MatDialog,
    private storage: AngularFireStorage,
    private moduleInstance: ModuleInstanceComponent
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

    this.cData.control.statusChanges.subscribe(value => {
      if (value === 'DISABLED') {
        tinymce.activeEditor.getBody().setAttribute('readonly', true);
      } else if (this.cData.control.disabled) {
        tinymce.activeEditor.getBody().setAttribute('readonly', false);
      }
    });
  }

  ngAfterViewInit() {
    this.registerTiny();
  }

  private registerTiny() {
    tinymce.init({
      target: this.textarea.nativeElement,
      height: 420,
      plugins: [
        'code',
        'print',
        'wordcount',
        'link',
        'image',
        'imagetools',
        'fullscreen'
      ],
      image_advtab: true,

      /**
       * Link settings
       */
      default_link_target: '_blank',
      readonly: this.cData.control.disabled,
      toolbar: [
        'undo redo',
        'insert',
        'styleselect',
        'bold italic',
        'forecolor backcolor',
        'alignleft aligncenter alignright alignjustify',
        'bullist numlist outdent indent',
        'link',
        'image',
        'youTube',
        'fullscreen'
      ].join(' | '),

      images_upload_handler: (blobInfo, success, failure) => {
        let module;

        this.moduleInstance.module$.pipe(take(1)).subscribe(data => {
          module = data;
        });

        this.storage
          .upload(blobInfo.filename(), blobInfo.blob(), {
            customMetadata: {
              collection: module.id
            }
          })
          .then(data => data.ref.getDownloadURL())
          .then(url => success(url))
          .catch(error => failure(error.toString()));
      },

      setup: editor => {
        this.editor = editor;

        editor.on('keyup change', () => {
          const tinyContent = editor.getContent();
          this.cData.control.setValue(tinyContent);
        });

        editor.ui.registry.addButton('youTube', {
          type: 'button',
          icon: 'embed',
          tooltip: 'Embed youtube video',
          onAction: () => {
            this.ytForm.reset(this.ytDefault);
            this.dialog
              .open(this.youTubeDialogTemplate, {width: '500px'})
              .afterClosed()
              .pipe(
                filter(value => !!value),
                take(1)
              )
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
