import {CdkDragEnter, moveItemInArray} from '@angular/cdk/drag-drop';
import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {RxDestroy} from '@jaspero/ng-helpers';
import {Breakpoint, currentBreakpoint$} from '@jf/consts/breakpoint.const';
import {ENV_CONFIG} from '@jf/consts/env-config.const';
import {readFile} from '@jf/utils/read-file';
import {forkJoin, from, Observable, of} from 'rxjs';
import {catchError, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {GeneratedImage} from '../../../interfaces/generated-image.interface';
import {formatGeneratedImages} from '../../../utils/format-generated-images';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as nanoid from 'nanoid';
import {PRODUCT_GENERATED_IMAGES} from '../../../../pages/products/consts/product-generated-images.const';

@Component({
  selector: 'jfsc-gallery-upload',
  templateUrl: './gallery-upload.component.html',
  styleUrls: ['./gallery-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GalleryUploadComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryUploadComponent extends RxDestroy
  implements OnInit, ControlValueAccessor {
  static STORAGE_URL =
    'https://firebasestorage.googleapis.com/v0/b/' +
    ENV_CONFIG.firebase.storageBucket;
  @ViewChild('urlUploadDialog', {static: true})
  urlUploadDialog: TemplateRef<any>;
  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;
  urlControl = new FormControl('');
  lastFrom: number;
  lastTo: number;
  values = [];
  toRemove = [];
  imageWidth$: Observable<number>;

  urlDialog: MatDialogRef<any>;

  @Input()
  moduleId: string;

  @Input()
  productId: string;

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private afs: AngularFireStorage,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit() {
    this.imageWidth$ = currentBreakpoint$.pipe(
      map(bp => {
        switch (bp) {
          case Breakpoint.s:
            return 330;
          case Breakpoint.m:
            return 270;
          case Breakpoint.l:
          case Breakpoint.xl:
          case Breakpoint.xs:
            return 250;
        }
      })
    );
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value: string[]) {
    if (value) {
      this.values.push(
        ...(value || []).map(val => ({
          data: val,
          live: true
        }))
      );
    }
  }

  addImage() {
    return () => {
      return this.http
        .get(this.urlControl.value, {
          withCredentials: false,
          responseType: 'blob'
        })
        .pipe(
          takeUntil(this.destroyed$),
          switchMap(res => {
            const name = [this.moduleId, this.productId, nanoid()].join('-');
            return from(
              this.afs.upload(name, res, {
                contentType: res.type,
                customMetadata: {
                  moduleId: this.moduleId,
                  documentId: this.productId,
                  ...(PRODUCT_GENERATED_IMAGES &&
                    formatGeneratedImages(PRODUCT_GENERATED_IMAGES))
                }
              })
            ).pipe();
          }),
          switchMap(a => {
            return a.ref.getDownloadURL();
          }),
          tap(url => {
            this.values.push({
              data: url,
              live: true
            });
            this.urlControl.setValue('');
            this.cdr.detectChanges();

            this.urlDialog.close();
          })
        );
    };
  }

  removeImage(event, index: number, item) {
    event.stopPropagation();
    if (item.live && item.data.includes(GalleryUploadComponent.STORAGE_URL)) {
      this.toRemove.push(item.data);
    }

    this.values.splice(index, 1);
    this.cdr.detectChanges();
  }

  entered(event: CdkDragEnter) {
    if (this.values && this.values.length === 1) {
      return;
    }

    this.lastFrom = event.item.data;
    this.lastTo = event.container.data;
  }

  ended() {
    if (this.values && this.values.length === 1) {
      return;
    }

    if (this.lastFrom === undefined || this.lastTo === undefined) {
      return;
    }

    moveItemInArray(this.values, this.lastFrom, this.lastTo);

    this.cdr.detectChanges();
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesUploaded(el: any) {
    forkJoin(
      Array.from(el.files).map((file: any) =>
        readFile(file).pipe(
          map(data => ({
            data,
            pushToLive: file,
            live: false
          }))
        )
      )
    ).subscribe(files => {
      this.values.push(...files);
      this.cdr.detectChanges();
    });

    el.value = '';
  }

  /**
   * Executes all uploads/removes to persist
   * the changes on server
   */
  save(
    moduleId: string,
    documentId: string,
    generatedImages?: GeneratedImage[]
  ) {
    /**
     * Break if there are no files to remove and there aren't any files to upload
     */
    if (!this.toRemove.length && !this.values.find(val => !val.live)) {
      this.onChange(this.values.map(val => val.data));
      return of([]);
    }

    return forkJoin([
      ...this.toRemove.map(file => {
        return from(this.afs.storage.refFromURL(file).delete()).pipe(
          /**
           * Dont' fail if files didn't delete
           */
          catchError(() => of([]))
        );
      }),
      ...this.values.reduce((acc, cur) => {
        if (!cur.live) {
          const name = [moduleId, documentId, cur.pushToLive.name].join('-');
          acc.push(
            from(
              this.afs.upload(name, cur.pushToLive, {
                contentType: cur.pushToLive.type,
                customMetadata: {
                  moduleId,
                  documentId,
                  ...(generatedImages && formatGeneratedImages(generatedImages))
                }
              })
            ).pipe(
              switchMap(task => task.ref.getDownloadURL()),
              tap(url => {
                cur.data = url;
              })
            )
          );
        }

        return acc;
      }, [])
    ]).pipe(
      tap(() => {
        this.onChange(this.values.map(val => val.data));
      })
    );
  }

  openUrlUpload() {
    this.urlDialog = this.dialog.open(this.urlUploadDialog, {
      width: '400px'
    });
  }
}
