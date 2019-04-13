import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {LANGUAGES} from '@jf/consts/languages.const';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StateService} from '../../services/state/state.service';

@Component({
  selector: 'jfsc-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    public dialog: MatDialog,
    public state: StateService,
    private router: Router
  ) {}

  @ViewChild('logoutDialog') logoutDialog: TemplateRef<any>;

  languages = LANGUAGES;
  languageName$: Observable<string>;
  links = [
    {label: 'Dashboard', icon: 'dashboard', value: '/dashboard'},
    {label: 'Products', icon: 'shopping_cart', value: '/products'},
    {label: 'Categories', icon: 'category', value: '/categories'},
    {label: 'Discounts', icon: 'local_offer', value: '/discounts'},
    {label: 'Orders', icon: 'receipt', value: '/orders'},
    {label: 'Customers', icon: 'supervisor_account', value: '/customers'},
    {label: 'Reviews', icon: 'star_rate', value: '/reviews'}
  ];

  ngOnInit() {
    this.languageName$ = this.state.language$.pipe(
      map(
        language => this.languages.find(lang => lang.value === language).label
      )
    );
  }

  changeLanguage(lang) {
    this.state.language$.next(lang);
  }

  logout() {
    this.afAuth.auth.signOut().then(() => this.router.navigate(['/login']));
  }

  openLogout() {
    this.dialog.open(this.logoutDialog, {
      width: '400px'
    });
  }
}
