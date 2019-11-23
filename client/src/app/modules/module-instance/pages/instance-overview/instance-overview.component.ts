import {SelectionModel} from '@angular/cdk/collections';
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {RxDestroy} from '@jaspero/ng-helpers';
// @ts-ignore
import {BehaviorSubject, combineLatest, merge, Subject} from 'rxjs';
import {map, shareReplay, skip, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {STATIC_CONFIG} from '../../../../../environments/static-config';
import {FilterMethod} from '../../../../shared/enums/filter-method.enum';
import {InstanceSort} from '../../../../shared/interfaces/instance-sort.interface';
import {ModuleOverviewView} from '../../../../shared/interfaces/module-overview-view.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {queue} from '../../../../shared/utils/queue.operator';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';
import {Parser} from '../../utils/parser';

@Component({
  selector: 'jms-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceOverviewComponent extends RxDestroy
  implements OnInit, AfterViewInit {
  constructor(
    private dbService: DbService,
    private state: StateService,
    private ioc: InstanceOverviewContextService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  hideAdd: boolean;
  currentView: string;
  activeView: string;
  showViewSelector: boolean;
  name: string;
  views: ModuleOverviewView[];

  ngOnInit() {
    this.ioc.module$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(module => {

        this.ioc.routeData = this.state.getRouterData({
          pageSize: 10
        });

        this.ioc.pageSize = new FormControl(this.ioc.routeData.pageSize);
        this.ioc.emptyState$ = new BehaviorSubject(false);
        this.ioc.filterChange$ = new BehaviorSubject(null);
        this.ioc.sortChange$ = new BehaviorSubject(null);
        this.ioc.searchControl = new FormControl('');
        this.ioc.hasMore$ = new BehaviorSubject(false);
        this.ioc.loadMore$ = new Subject<boolean>();
        this.ioc.selection = new SelectionModel<string>(true, []);

        this.name = module.name;
        this.currentView = this.getCurrentView('table');
        this.showViewSelector = false;
        this.views = [];
        this.hideAdd = false;

        if (module.layout) {

          if (module.layout.sort) {
            this.ioc.sortChange$.next(module.layout.sort);
          }

          if (module.layout.filterModule && module.layout.filterModule.value) {
            this.ioc.filterChange$.next(module.layout.filterModule.value);
          }

          if (module.layout.overview) {
            if (module.layout.overview.defaultView) {
              this.currentView = this.getCurrentView(module.layout.overview.defaultView);
            }

            this.showViewSelector = !!module.layout.overview.showViewSelector;

            if (this.showViewSelector) {
              this.views = module.layout.overview.views || [];
            }

            if (module.layout.hideAdd) {
              this.hideAdd = module.layout.hideAdd.includes(this.state.role);
            }
          }
        }

        this.ioc.items$ = combineLatest([
            this.ioc.pageSize.valueChanges
              .pipe(
                startWith(this.ioc.routeData.pageSize)
              ),
            this.ioc.filterChange$,
            this.ioc.searchControl
              .valueChanges
              .pipe(
                startWith(this.ioc.searchControl.value)
              ),
          ...module.layout.sort ? [this.ioc.sortChange$] : []
          ]).pipe(
            switchMap(([pageSize, filters, search, sort]) => {

              const routeData = {...this.ioc.routeData};

              routeData.pageSize = pageSize as number;
              routeData.filters = filters;

              if (sort) {
                routeData.sort = sort as InstanceSort;
                routeData.sort.active = Parser.standardizeKey(
                  routeData.sort.active
                );
              } else {
                routeData.sort = null;
              }

              this.state.setRouteData(routeData);
              this.ioc.routeData = routeData;

              return this.dbService.getDocuments(
                module.id,
                pageSize,
                sort,
                null,
                null,
                search ?
                  [{
                    key: module.layout.searchModule.key,
                    operator: FilterMethod.ArrayContains,
                    value: search.trim().toLowerCase()
                  }] :
                  filters
              )
                .pipe(
                  queue()
                );
            }),
            switchMap(snapshots => {
              let cursor;

              this.ioc.hasMore$.next(snapshots.length === this.ioc.routeData.pageSize);

              if (snapshots.length) {
                cursor = snapshots[snapshots.length - 1].payload.doc;
                this.ioc.emptyState$.next(false);
              } else {
                this.ioc.emptyState$.next(true);
              }

              return merge(
                this.ioc.loadMore$.pipe(
                  switchMap(() =>
                    this.dbService
                      .getDocuments(
                        module.id,
                        this.ioc.routeData.pageSize,
                        this.ioc.routeData.sort,
                        cursor,
                        null,
                        this.ioc.searchControl.value ?
                          [{
                            key: module.layout.searchModule.key,
                            operator: FilterMethod.ArrayContains,
                            value: this.ioc.searchControl.value.trim().toLowerCase()
                          }] :
                          this.ioc.routeData.filters
                      )
                      .pipe(
                        queue(),
                        tap(snaps => {
                          if (snaps.length < this.ioc.routeData.pageSize) {
                            this.ioc.hasMore$.next(false);
                          }

                          if (snaps.length) {
                            cursor = snaps[snaps.length - 1].payload.doc;

                            snapshots.push(
                              ...snaps
                            );
                          }
                        })
                      )
                  )
                ),

                this.dbService.getStateChanges(module.id, null, null).pipe(
                  skip(1),
                  tap(snaps => {
                    snaps.forEach(snap => {
                      const index = snapshots.findIndex(
                        doc => doc.id === snap.payload.doc.id
                      );

                      switch (snap.type) {
                        case 'added':
                          if (index === -1) {
                            snapshots.push(snap);
                          }
                          break;
                        case 'modified':
                          if (index !== -1) {
                            snapshots[index] = snap;
                          }
                          break;
                        case 'removed':
                          if (index !== -1) {
                            snapshots.splice(index, 1);
                          }
                          break;
                      }
                    });
                  })
                )
              ).pipe(
                startWith({}),
                map(() => [...snapshots])
              );
            })
          )
          .pipe(
            shareReplay(1)
          );

        this.ioc.allChecked$ = combineLatest([
          this.ioc.items$,
          this.ioc.selection.changed.pipe(startWith({}))
        ]).pipe(
          map(([items]) => ({
            checked: this.ioc.selection.selected.length === items.length
          }))
        );

        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.ioc.allChecked$ = combineLatest([
      this.ioc.items$,
      this.ioc.selection.changed.pipe(startWith({}))
    ]).pipe(
      map(([items]) => ({
        checked: this.ioc.selection.selected.length === items.length
      }))
    );
  }

  getCurrentView(selector: string) {
    this.activeView = selector;

    const toUse = selector.startsWith(STATIC_CONFIG.elementSelectorPrefix) ? selector : STATIC_CONFIG.elementSelectorPrefix + selector;

    return `<${toUse}></${toUse}>`;
  }

  changeCurrentView(view: string) {
    this.currentView = this.getCurrentView(view);
    this.cdr.markForCheck();
  }
}
