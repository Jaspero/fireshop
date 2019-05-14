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
import {RxDestroy} from '@jaspero/ng-helpers';
import {BehaviorSubject, from} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';

@Component({
  selector: 'jfs-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent extends RxDestroy implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFireStorage,
    private angularFireStore: AngularFirestore,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

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
  loading$ = new BehaviorSubject(false);

  ngOnInit() {
    // showing change password tab only for user who are sign in with email and password
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
    this.loading$.next(true);
    const fileToUpload = Array.from(file)[0];
    const userID = this.afAuth.auth.currentUser.uid;
    if (fileToUpload) {
      from(
        this.afs.upload(userID, fileToUpload, {
          contentType: fileToUpload['type'],
          customMetadata: {
            skipDelete: 'true'
          }
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
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe(() => {
          this.loading$.next(false);
        });
    }
  }
}
