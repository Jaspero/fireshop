import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
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

  currentUser: string;
  navigationExpanded = false;

  ngOnInit() {
    this.afAuth.user.subscribe(value => {
      this.currentUser = value.email;
    });
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
