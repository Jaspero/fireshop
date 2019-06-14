import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
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
  navigationExpanded = false;

  ngOnInit() {
    this.currentUser$ = this.afAuth.user;
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
