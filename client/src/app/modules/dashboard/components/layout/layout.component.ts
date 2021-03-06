import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {safeEval} from '@jaspero/form-builder';
import {combineLatest, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../../../environments/static-config';
import {NavigationItemType} from '../../../../shared/enums/navigation-item-type.enum';
import {NavigationItemWithActive} from '../../../../shared/interfaces/navigation-item-with-active.interface';
import {StateService} from '../../../../shared/services/state/state.service';

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
  links$: Observable<NavigationItemWithActive[]>;
  staticConfig = STATIC_CONFIG;
  navigationExpanded = false;

  navigationItemType = NavigationItemType;

  ngOnInit() {
    this.currentUser$ = this.afAuth.user;

    /**
     * There is a slight delay between when logout happens
     * and the actual redirect to the login page, because of this
     * a request is sent for fetching modules which isn't authorized
     * so we make sure to only fetch modules if the user is authenticated
     */
    this.links$ = this.currentUser$
      .pipe(
        switchMap(user => {
          if (user) {
            return combineLatest([
              this.state.layout$,
              this.state.modules$
            ])
              .pipe(
                map(([layout, modules]) => {
                  if (layout.navigation) {
                    return layout.navigation.items.reduce((acc, item) => {
                      if (
                        !item.authorized ||
                        item.authorized.includes(this.state.role)
                      ) {

                        if (item.function) {
                          const value = safeEval(item.value);
                          if (value) {
                            item.value = value(this.state.user, this.state.role);
                          }
                        }

                        acc.push({
                          ...item,
                          ...item.children ?
                            {
                              children: item.children
                                .reduce((a, c) => {
                                  if (!c.authorized || c.authorized.includes(this.state.role)) {
                                    if (c.function) {
                                      const value = safeEval(c.value);
                                      if (value) {
                                        c.value = value(this.state.user, this.state.role);
                                      }
                                    }

                                    a.push({
                                      ...c,
                                      routerOptions: {
                                        exact: c.matchExact || false
                                      }
                                    });
                                  }

                                  return a;
                                }, [])
                            } : {},
                          routerOptions: {
                            exact: item.matchExact || false
                          }
                        });
                      }

                      return acc;
                    }, []);
                  } else {
                    const links: NavigationItemWithActive[] = modules.reduce((acc, item) => {

                      if (
                        !item.authorization ||
                        !item.authorization.read ||
                        item.authorization.read.includes(this.state.role)
                      ) {
                        acc.push({
                          icon:
                            item.layout && item.layout.icon ? item.layout.icon : 'folder_open',
                          label: item.name,
                          type: NavigationItemType.Link,
                          routerOptions: {
                            exact: false
                          },
                          value: [
                            '/m',
                            item.id,
                            ...(item.layout && item.layout.directLink
                              ? ['single', item.layout.directLink]
                              : ['overview'])
                          ]
                            .join('/')
                        });
                      }

                      return acc;
                    }, []);

                    links.unshift({
                      label: 'LAYOUT.DASHBOARD',
                      icon: 'dashboard',
                      type: NavigationItemType.Link,
                      value: '/dashboard',
                      routerOptions: {
                        exact: false
                      }
                    });

                    links.push(
                      {
                        label: 'LAYOUT.MODULES',
                        icon: 'view_module',
                        type: NavigationItemType.Link,
                        value: '/module-definition/overview',
                        routerOptions: {
                          exact: false
                        }
                      },
                      {
                        label: 'LAYOUT.SETTINGS',
                        icon: 'settings',
                        type: NavigationItemType.Link,
                        value: '/settings',
                        routerOptions: {
                          exact: false
                        }
                      }
                    );

                    return links;
                  }
                })
              )
          }

          return of([]);
        })
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
    this.afAuth.signOut()
      .then(() =>
        this.router.navigate(['/login'])
      );
  }
}
