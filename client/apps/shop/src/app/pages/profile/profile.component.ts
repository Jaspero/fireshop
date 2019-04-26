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
import {forkJoin, from} from 'rxjs';
import {readFile} from '@jf/utils/read-file';
import {map, switchMap, take} from 'rxjs/operators';

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
    }
  ];

  activeLink: any;
  downloadURL: any;

  ngOnInit() {
    const url = this.router.url.replace('/my-profile/', '');
    this.activeLink = this.links.find(val => val.route === url);
  }

  openFileUpload() {
    this.fileEl.nativeElement.click();
  }

  filesImage(file) {
    const fileToUpload = Array.from(file)[0];
    from(
      this.afs.upload('my-profile-pic', fileToUpload, {
        contentType: fileToUpload.type
      })
    )
      .pipe(switchMap(res => res.ref.getDownloadURL()))
      .subscribe(res => {
        console.log('res', res);
        this.downloadURL = res;
        this.cdr.detectChanges();
      });
  }
}
