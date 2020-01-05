import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import {ViewportRuler} from '@angular/cdk/overlay';
import {HttpClient} from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {MatDialog} from '@angular/material';
import {forkJoin, from, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {ENV_CONFIG} from '../../../../../../env-config';
import {StateService} from '../../../../../shared/services/state/state.service';
import {notify} from '../../../../../shared/utils/notify.operator';
import {FieldData} from '../../../interfaces/field-data.interface';
import {GeneratedImage} from '../../../interfaces/generated-image.interface';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {formatGeneratedImages} from '../../../utils/format-generated-images';
import {switchItemLocations} from '../../../utils/switch-item-locations';
import {FieldComponent} from '../../field/field.component';
import {readFile} from './read-file';

interface GalleryData extends FieldData {
  allowUrl?: boolean;
  allowServerUpload?: boolean;
  generatedImages?: GeneratedImage[];
}

@Component({
  selector: 'jms-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent extends FieldComponent<GalleryData>
  implements OnInit, AfterViewInit {
  static STORAGE_URL =
    'https://firebasestorage.googleapis.com/v0/b/' +
    ENV_CONFIG.firebase.storageBucket;

  constructor(
    @Inject(COMPONENT_DATA) public cData: GalleryData,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private state: StateService,
    private viewportRuler: ViewportRuler
  ) {
    super(cData);
  }

  @ViewChild(CdkDropListGroup, {static: true})
  listGroup: CdkDropListGroup<CdkDropList>;

  @ViewChild(CdkDropList, {static: true})
  placeholder: CdkDropList;

  @ViewChild('modal', {static: true})
  modalTemplate: TemplateRef<any>;

  @ViewChild('imagesSort', {static: true})
  imagesSort: TemplateRef<any>;

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public activeContainer;

  files: File[] = [];
  toRemove = [];

  ngOnInit() {
    this.state.saveComponents.push(this);
  }

  ngAfterViewInit() {
    const phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }

  openUploadDialog() {
    this.dialog.open(this.modalTemplate, {
      width: '420px'
    });
  }

  addImage(image: string) {
    this.http
      .get(image, {
        withCredentials: false,
        responseType: 'blob'
      })
      .pipe(notify({
        error: 'FIELDS.GALLERY.UPLOAD_ERROR',
        success: null
      }))
      .subscribe(res => {
        const urlCreator = window.URL || (window as any).webkitURL;
        const value = this.cData.control.value;

        value.push({
          data: urlCreator.createObjectURL(res),
          live: true
        });

        this.cData.control.setValue(value);
        this.cdr.detectChanges();
      });
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  openSortImages() {
    this.state.saveComponents.push(this);
    this.dialog.open(this.imagesSort, {
      width: '800px'
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const value = this.cData.control.value;
    switchItemLocations(value, event.previousIndex, event.currentIndex);
    this.cData.control.setValue(value);
    this.cdr.detectChanges();
  }

  move(up = false, index: number) {
    const currentIndex = up ? index - 1 : index + 1;
    const value = this.cData.control.value;
    moveItemInArray(value, index, currentIndex);
    this.cData.control.setValue(value);
    this.cdr.detectChanges();
  }

  filesUploaded(el: HTMLInputElement | FileList) {
    const files = Array.from(el instanceof FileList ? el : el.files);

    forkJoin(
      files.map(file =>
        readFile(file).pipe(
          map(data => ({
            data,
            pushToLive: file,
            live: false
          }))
        )
      )
    ).subscribe(
      fls => {
        const value = this.cData.control.value;
        value.push(...fls);
        this.cData.control.setValue(value);

        if (!(el instanceof FileList)) {
          el.value = '';
        }

        this.cdr.detectChanges();
      },
      () => {
        if (!(el instanceof FileList)) {
          el.value = '';
        }
      }
    );
  }

  removeImage(index: number, item) {
    if (item.live && item.data.includes(GalleryComponent.STORAGE_URL)) {
      this.toRemove.push(item.data);
    }

    this.cData.control.value.splice(index, 1);
  }

  sortDrop(event: CdkDragDrop<string[]>) {
    const value = this.cData.control.value;
    moveItemInArray(value, event.previousIndex, event.currentIndex);
    this.cData.control.setValue(value);
  }

  /**
   * Drag and Drop
   */
  dragMoved(e: CdkDragMove) {
    const point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped() {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex !== this.targetIndex) {
      const value = this.cData.control.value;
      moveItemInArray(value, this.sourceIndex, this.targetIndex);
      this.cData.control.setValue(value);
    }
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop === this.placeholder) {
      return true;
    }

    if (drop !== this.activeContainer) {
      return false;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    const dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex
      ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top
    };
  }

  /**
   * Executes all uploads/removes to persist
   * the changes on server
   */
  save(moduleId: string, documentId: string) {
    if (
      !this.toRemove.length &&
      !this.cData.control.value ||
      !this.cData.control.value.find(val => !val.live)
    ) {
      return of([]);
    }

    return forkJoin([
      ...this.toRemove.map(file =>
        from(this.storage.storage.refFromURL(file).delete()).pipe(
          /**
           * Dont' fail if files didn't delete
           */
          catchError(() => of([]))
        )
      ),
      ...this.cData.control.value.reduce((acc, cur) => {
        if (cur.live !== undefined && !cur.live) {

          const name = [
            moduleId,
            documentId,
            cur.pushToLive.name
          ]
            .join('-');

          acc.push(
            from(
              this.storage.upload(name, cur.pushToLive, {
                contentType: cur.pushToLive.type,
                customMetadata: {
                  moduleId,
                  documentId,
                  ...this.cData.generatedImages &&
                    formatGeneratedImages(this.cData.generatedImages)
                }
              })
            ).pipe(
              switchMap(task => task.ref.getDownloadURL()),
              tap(url => {
                cur.data = url;
              })
            )
          );
        } else {
          acc.push(cur);
        }

        return acc;
      }, [])
    ]).pipe(
      tap(() =>
        this.cData.control.setValue(
          this.cData.control.value.map(item => (item.data ? item.data : item))
        )
      )
    );
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
  const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right;
}
