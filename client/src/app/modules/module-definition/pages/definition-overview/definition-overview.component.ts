import {SelectionModel} from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  merge,
  Observable
} from 'rxjs';
import {map, startWith, switchMap, take, tap} from 'rxjs/operators';
import {Module} from '../../../../shared/interfaces/module.interface';
import {RouteData} from '../../../../shared/interfaces/route-data.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {confirmation} from '../../../../shared/utils/confirmation';
import {notify} from '../../../../shared/utils/notify.operator';

@Component({
  selector: 'jms-definition-overview',
  templateUrl: './definition-overview.component.html',
  styleUrls: ['./definition-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionOverviewComponent implements OnInit {
  constructor(
    private dbService: DbService,
    private state: StateService,
    private fb: FormBuilder
  ) {}

  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  displayedColumns = ['check', 'name', 'createdOn', 'actions'];

  items$: Observable<Module[]>;
  allChecked$: Observable<{checked: boolean}>;
  emptyState$ = new BehaviorSubject(false);
  dataLoading$ = new BehaviorSubject(true);

  selection = new SelectionModel<string>(true, []);
  filters: FormGroup;
  options: RouteData;

  ngOnInit() {
    this.options = this.state.getRouterData();

    this.filters = this.fb.group(this.options.filters);

    this.items$ = merge(
      this.sort.sortChange.pipe(
        tap((sort: any) => {
          this.options.sort = sort;
          this.state.setRouteData(this.options);
        })
      ),

      this.filters.valueChanges.pipe(
        tap(filters => {
          this.options.filters = filters;
          this.state.setRouteData(this.options);
        })
      )
    ).pipe(
      startWith({}),
      switchMap(() => this.state.modules$),
      map(modules => {
        if (this.options.filters.search) {
          modules = modules.filter(item =>
            item.name.toLowerCase().includes(this.options.filters.search)
          );
        }

        modules = modules.sort((itemOne, itemTwo) => {
          const {direction, active} = this.options.sort;
          return direction === 'desc'
            ? itemOne[active] - itemTwo[active]
            : itemTwo[active] - itemOne[active];
        });

        return modules;
      }),
      tap(modules => {
        this.emptyState$.next(!modules.length);
        this.dataLoading$.next(false);
      })
    );

    this.allChecked$ = combineLatest([
      this.items$,
      this.selection.changed.pipe(startWith({}))
    ]).pipe(
      map(([items]) => ({
        checked: this.selection.selected.length === items.length
      }))
    );
  }

  masterToggle() {
    combineLatest([this.allChecked$, this.items$])
      .pipe(take(1))
      .subscribe(([check, items]) => {
        if (check.checked) {
          this.selection.clear();
        } else {
          items.forEach(row => this.selection.select(row.id));
        }
      });
  }

  deleteOne(item: Module) {
    confirmation([
      switchMap(() => this.dbService.removeModule(item.id)),
      notify()
    ]);
  }

  deleteSelection() {
    confirmation([
      switchMap(() =>
        forkJoin(
          this.selection.selected.map(id => this.dbService.removeModule(id))
        )
      ),
      notify()
    ]);
  }
}
