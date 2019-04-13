import {
  CdkDragEnd,
  CdkDragEnter,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import {HttpClient} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {RxDestroy} from '@jaspero/ng-helpers';
import {Breakpoint, currentBreakpoint$} from '@jf/consts/breakpoint.const';
import * as nanoid from 'nanoid';
import {forkJoin, Observable} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'jfsc-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent extends RxDestroy
  implements OnInit, ControlValueAccessor {
  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private afs: AngularFireStorage,
    private http: HttpClient,
    private el: ElementRef,
    private cdk: ChangeDetectorRef
  ) {
    super();
  }

  @ViewChild('urlUploadDialog') urlUploadDialog: TemplateRef<any>;

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  urlControl = new FormControl('');
  values = [];
  lastFrom: number;
  lastTo: number;
  loader: number;
  deletingObject = {};
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  imageWidth$: Observable<number>;

  toRemove = [];

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
    let gallery = [];
    if (value) {
      gallery = (value || []).map(val => {
        return {
          data: val,
          live: true
        };
      });
      this.values.push(...gallery);
    }
  }

  addImage() {
    this.http
      .get(this.urlControl.value, {
        withCredentials: false,
        responseType: 'blob'
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        const urlCreator = window.URL || window['webkitURL'];
        this.values.push({
          data: urlCreator.createObjectURL(res),
          live: true
        });
        this.urlControl.setValue('');
        this.cdr.detectChanges();
        this.onChange([...this.values]);
      });
  }

  removeImage(index: number, item) {
    if (!item.live) {
      this.toRemove.push(item);
    }
    this.values.splice(index, 1);
    this.onChange([...this.values]);
    this.cdr.detectChanges();
  }

  entered(e: CdkDragEnter) {
    if (this.values && this.values.length === 1) {
      return;
    }

    this.lastFrom = e.item.data;
    this.lastTo = e.container.data;
  }

  ended(e: CdkDragEnd) {
    if (this.values && this.values.length === 1) {
      return;
    }
    if (this.lastFrom === undefined || this.lastTo === undefined) {
      return;
    }
    moveItemInArray(this.values, this.lastFrom, this.lastTo);
    this.onChange([...this.values]);
    this.cdr.detectChanges();
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  async filesUploaded(event: FileList) {
    const final = [];

    for (let i = 0; i < event.length; i++) {
      await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(event[i]);
        reader.onload = () => {
          final.push({
            data: reader.result,
            pushToLive: event[i],
            live: false
          });
          resolve();
        };
      });
    }
    this.values.push(...final);
    this.cdr.detectChanges();
  }

  /**
   * Executes all uploads/removes to persist
   * the changes on server
   */
  save() {
    return forkJoin([
      ...this.toRemove.map(file => {
        return this.afs.ref(file.data).delete();
      }),
      ...this.values.reduce((acc, cur) => {
        if (!cur.live) {
          this.task = this.afs.upload(nanoid(), cur.pushToLive);
          this.percentage = this.task.percentageChanges();
          this.task.snapshotChanges();
          acc.push(this.task);
        }
        return acc;
      }, [])
    ]);
  }

  openUrlUpload() {
    this.dialog.open(this.urlUploadDialog, {
      width: '400px'
    });
  }
}
