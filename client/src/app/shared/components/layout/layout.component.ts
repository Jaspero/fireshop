import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StateService} from '../../services/state/state.service';

@Component({
  selector: 'jms-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  constructor(
    public state: StateService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  currentUser$: Observable<any>;
  links$: Observable<
    Array<{
      icon: string;
      name: string;
      link: string[];
    }>
  >;
  navigationExpanded = false;

  ngOnInit() {
    this.currentUser$ = this.afAuth.user;
    this.links$ = this.state.modules$.pipe(
      map(items =>
        items.map(item => ({
          icon:
            item.layout && item.layout.icon ? item.layout.icon : 'folder_open',
          name: item.name,
          link: [
            '/m',
            item.id,
            ...(item.layout && item.layout.directLink
              ? ['single', item.layout.directLink]
              : ['overview'])
          ]
        }))
      )
    );
  }

  toggleMenu() {
    this.navigationExpanded = !this.navigationExpanded;
  }

  closeMenu() {
    if (this.navigationExpanded) {
      this.navigationExpanded = false;
    }
  }

  logOut() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }
}
