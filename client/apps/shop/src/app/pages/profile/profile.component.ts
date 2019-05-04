import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';

@Component({
  selector: 'jfs-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFireStorage,
    private angularFireStore: AngularFirestore,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('file')
  fileEl: ElementRef<HTMLInputElement>;

  links = [
    {
      label: 'Settings',
      route: 'settings'
    },
    {
      label: 'Wish List',
      route: 'wish-list'
    },
    {
      label: 'Orders',
      route: 'orders'
    },
    {
      label: 'Reviews',
      route: 'reviews'
    },
    {
      label: 'Change password',
      route: 'change-password'
    }
  ];

  activeLink: any;
  downloadURL = 'assets/images/profile-placeholder.svg';
  loadImg: boolean;

  ngOnInit() {
    if (
      this.afAuth.auth.currentUser.providerData[0].providerId !== 'password'
    ) {
      this.links.splice(4, 1);
    }

    const url = this.router.url.replace('/my-profile/', '');
    this.activeLink = this.links.find(val => val.route === url);
    this.angularFireStore
      .doc(
        `${FirestoreCollections.Customers}/${this.afAuth.auth.currentUser.uid}`
      )
      .snapshotChanges()
      .subscribe(rex => {
        if (rex.payload.data() && rex.payload.data()['profileImage']) {
          this.downloadURL = rex.payload.data()['profileImage'];
        }
        this.loadImg = true;
        this.cdr.detectChanges();
      });
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(file) {
    const fileToUpload = Array.from(file)[0];
    const userID = this.afAuth.auth.currentUser.uid;
    from(
      this.afs.upload(userID, fileToUpload, {
        contentType: fileToUpload['type']
      })
    )
      .pipe(
        switchMap(res => res.ref.getDownloadURL()),
        switchMap(res => {
          this.downloadURL = res;
          this.cdr.detectChanges();
          return this.angularFireStore
            .doc(`${FirestoreCollections.Customers}/${userID}`)
            .update({profileImage: res});
        })
      )
      .subscribe();
  }
}
