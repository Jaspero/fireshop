import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent implements OnInit {
  constructor() {}

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  ngOnInit() {}

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(file) {
    const fileToUpload = Array.from(file)[0];
    console.log('fileToUpload', fileToUpload);

    // const userID = this.afAuth.auth.currentUser.uid;
    // from(
    //   this.afs.upload(userID, fileToUpload, {
    //     contentType: fileToUpload['type']
    //   })
    // )
    //   .pipe(
    //     switchMap(res => res.ref.getDownloadURL()),
    //     switchMap(res => {
    //       console.log('res', res);
    //       this.downloadURL = res;
    //       this.cdr.detectChanges();
    //       return this.angularFireStore
    //         .doc(`${FirestoreCollections.Customers}/${userID}`)
    //         .update({profileImage: res});
    //     })
    //   )
    //   .subscribe();
  }
}
