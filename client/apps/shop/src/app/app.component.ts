import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit
} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {SwUpdate} from '@angular/service-worker';
import {BROWSER_CONFIG} from '@jf/consts/browser-config.const';
import {interval, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {CartComponent} from './shared/components/cart/cart.component';
import {LoginSignupDialogComponent} from './shared/components/login-signup-dialog/login-signup-dialog.component';
import {SearchComponent} from './shared/components/search/search.component';
import {UpdateAvailableComponent} from './shared/components/update-available/update-available.component';
import {CartService} from './shared/services/cart/cart.service';
import {StateService} from './shared/services/state/state.service';

@Component({
  selector: 'jfs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public state: StateService,
    public cart: CartService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private swUpdate: SwUpdate
  ) {}

  /**
   * Useful for showing backgrounds in css
   */
  @HostBinding('class')
  webpClass: string;

  showLayout$: Observable<boolean>;
  cartBadge$: Observable<number | string>;

  ngOnInit() {
    this.webpClass = BROWSER_CONFIG.webpSupported ? 'webp' : 'no-webp';
    this.cartBadge$ = this.cart.numOfItems$.pipe(
      map(inCart => (inCart ? inCart : ''))
    );
    this.showLayout$ = this.state.currentRoute$.pipe(
      map(res => !res.data.hideLayout)
    );

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),

        /**
         * Always emit page change
         */
        map((route: NavigationEnd) => {
          let activeRoute = this.activateRoute;
          let data: any = {};

          /**
           * Only forward data from the last child with
           * a data object
           */
          while (activeRoute.firstChild) {
            activeRoute = activeRoute.firstChild;

            if (Object.keys(activeRoute.snapshot.data).length) {
              data = activeRoute.snapshot.data;
            }
          }

          return {
            data,
            outlet: activeRoute.outlet,
            url: route.url
          };
        }),
        filter(route => route.outlet === 'primary')
      )
      .subscribe(route => {
        this.state.currentRoute$.next({data: route.data, url: route.url});
      });

    if (environment.serviceWorker) {
      this.connectSw();
    }
  }

  openCheckout() {
    this.dialog.open(CartComponent, {
      width: '400px'
    });
  }

  openSearch() {
    this.dialog.open(SearchComponent, {
      width: '400px'
    });
  }

  logIn() {
    this.dialog.open(LoginSignupDialogComponent, {
      width: '400px'
    });
  }

  logOut() {
    const {data} = this.state.currentRoute$.getValue();

    /**
     * If we're currently on a route marked private
     * navigate to the home screen
     */
    if (data.private) {
      this.router.navigate(['/']);
    }

    this.afAuth.auth.signOut();
  }

  private connectSw() {
    /**
     * Checks for updates every 5 minutes
     */
    interval(300000).subscribe(() => {
      this.swUpdate.checkForUpdate();
    });

    this.swUpdate.available.subscribe(() => {
      this.snackBar.openFromComponent(UpdateAvailableComponent);
    });
  }
}
