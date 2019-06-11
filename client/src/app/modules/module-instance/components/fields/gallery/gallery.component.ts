import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {FieldComponent, FieldData} from '../../field/field.component';
import {COMPONENT_DATA} from '../../../utils/create-component-injector';
import {MatDialog} from '@angular/material';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {readFile} from './read-file';
import {CdkDragEnter, moveItemInArray} from '@angular/cdk/drag-drop';
import {HttpClient} from '@angular/common/http';
import {notify} from '../../../../../shared/utils/notify.operator';
import {ENV_CONFIG} from '../../../../../../env-config';
import {AngularFirestore} from '@angular/fire/firestore';

interface GalleryData extends FieldData {
  allowUrl?: boolean;
  allowServerUpload?: boolean;
}

@Component({
  selector: 'jms-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent extends FieldComponent<GalleryData> {
  static STORAGE_URL =
    'https://firebasestorage.googleapis.com/v0/b/' +
    ENV_CONFIG.firebase.storageBucket;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private afs: AngularFirestore,
    @Inject(COMPONENT_DATA) public cData: GalleryData
  ) {
    super(cData);
  }

  @ViewChild('modal', {static: true})
  modalTemplate: TemplateRef<any>;

  @ViewChild('file', {static: true})
  fileEl: ElementRef<HTMLInputElement>;

  lastFrom: number;
  lastTo: number;

  toRemove = [];

  openUploadDialog() {
    this.dialog.open(this.modalTemplate);
  }

  addImage(image: string) {
    this.http
      .get(image, {
        withCredentials: false,
        responseType: 'blob'
      })
      .pipe(
        notify({error: 'Error on uploading image.', success: ''})
      )
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

  filesUploaded(fileList: FileList) {
    forkJoin(
      Array.from(fileList).map(file =>
        readFile(file)
          .pipe(
            map(data => ({
              data,
              pushToLive: file,
              live: false
            }))
          )
      )
    ).subscribe(files => {
      const value = this.cData.control.value;
      value.push(...files);
      this.cData.control.setValue(value);
      this.cdr.detectChanges();
    });
  }

  entered(event: CdkDragEnter) {
    if (this.cData.control.value && this.cData.control.value.length === 1) {
      return;
    }

    this.lastFrom = event.item.data;
    this.lastTo = event.container.data;
  }

  ended() {
    if (this.cData.control.value && this.cData.control.value.length === 1) {
      return;
    }

    if (this.lastFrom === undefined || this.lastTo === undefined) {
      return;
    }

    moveItemInArray(this.cData.control.value, this.lastFrom, this.lastTo);
  }

  removeImage(index: number, item) {
    if (item.live && item.data.includes(GalleryComponent.STORAGE_URL)) {
      this.toRemove.push(item.data);
    }

    this.cData.control.value.splice(index, 1);
  }

  /**
   * Executes all uploads/removes to persist
   * the changes on server
   */
  save() {
    /*/!**
     * Break if there are no files to remove and there aren't any files to upload
     *!/
    if (!this.toRemove.length && !this.cData.control.value.find(val => !val.live)) {
      return of([]);
    }

    return forkJoin([
      ...this.toRemove.map(file =>
        from(this.afs.storage.refFromURL(file).delete()).pipe(
          /!**
           * Dont' fail if files didn't delete
           *!/
          catchError(() => of([]))
        )
      ),
      ...this.cData.control.value.reduce((acc, cur) => {
        if (!cur.live) {
          acc.push(
            from(
              this.afs.upload(cur.pushToLive.name, cur.pushToLive, {
                contentType: cur.pushToLive.type
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
    ]);*/
  }

}

