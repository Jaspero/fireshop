import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {Router} from '@angular/router';
import {FirestoreCollections} from '@jf/enums/firestore-collections.enum';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {customer} from '../../../../../../../functions/src/consts/schemas.const';
import {StateService} from '../../shared/services/state/state.service';

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
    private state: StateService
  ) {}

  @ViewChild('file', {static: true})
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
    },
    {
      label: 'Gift cards',
      route: 'gift-cards'
    }
  ];

  activeLink: any;
  downloadURL$: Observable<string>;
  loading$ = new BehaviorSubject(false);

  ngOnInit() {
    // showing change password tab only for user who are sign in with email and password
    if (
      this.afAuth.auth.currentUser.providerData[0].providerId !== 'password'
    ) {
      this.links.splice(4, 1);
    }

    this.downloadURL$ = this.state.user$.pipe(
      map(({customerData}) =>
        customerData
          ? customerData.profileImage
          : 'assets/images/profile-placeholder.svg'
      )
    );

    const url = this.router.url.replace('/my-profile/', '');
    this.activeLink = this.links.find(val => val.route === url);
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(el: HTMLInputElement) {
    this.loading$.next(true);

    const fileToUpload = Array.from(el.files)[0];
    const userID = this.afAuth.auth.currentUser.uid;

    el.value = '';

    if (fileToUpload) {
      from(
        this.afs.upload(`/users/${userID}/profilePicture`, fileToUpload, {
          contentType: fileToUpload['type'],
          customMetadata: {
            skipDelete: 'true'
          }
        })
      )
        .pipe(
          switchMap(res => res.ref.getDownloadURL()),
          switchMap(profileImage =>
            this.angularFireStore
              .doc(`${FirestoreCollections.Customers}/${userID}`)
              .update({profileImage})
          ),
          take(1)
        )
        .subscribe(() => {
          this.loading$.next(false);
        });
    }
  }
}
