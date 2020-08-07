import {Clipboard} from '@angular/cdk/clipboard';
import {SelectionModel} from '@angular/cdk/collections';
import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {saveAs} from 'file-saver';
import {BehaviorSubject, combineLatest, forkJoin, merge, Observable} from 'rxjs';
import {map, shareReplay, startWith, switchMap, take, tap} from 'rxjs/operators';
import {LayoutSettingsComponent} from '../../../../../../shared/components/layout-settings/layout-settings.component';
import {ExampleType} from '../../../../../../shared/enums/example-type.enum';
import {Example} from '../../../../../../shared/interfaces/example.interface';
import {Module} from '../../../../../../shared/interfaces/module.interface';
import {RouteData} from '../../../../../../shared/interfaces/route-data.interface';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {confirmation} from '../../../../../../shared/utils/confirmation';
import {notify} from '../../../../../../shared/utils/notify.operator';
import {queue} from '../../../../../../shared/utils/queue.operator';
import {DEFAULT_DEFINITION_VALUE} from '../definition-instance/consts/default-definition-value.const';
import {DEFAULT_LAYOUT_VALUE} from '../definition-instance/consts/default-layout-value.const';
import {DEFAULT_SCHEMA_VALUE} from '../definition-instance/consts/default-schema-value.const';

@UntilDestroy()
@Component({
  selector: 'jms-definition-overview',
  templateUrl: './definition-overview.component.html',
  styleUrls: ['./definition-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionOverviewComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private dbService: DbService,
    private state: StateService,
    private fb: FormBuilder,
    private router: Router,
    private clipboard: Clipboard
  ) {}

  @ViewChild('modal', {static: true})
  modalTemplate: TemplateRef<any>;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  displayedColumns = ['check', 'name', 'createdOn', 'description', 'actions'];
  exampleColumns = ['name', 'description'];

  items$: Observable<Module[]>;
  allChecked$: Observable<{checked: boolean}>;
  emptyState$ = new BehaviorSubject(false);
  dataLoading$ = new BehaviorSubject(true);
  moduleExamples$ = new Observable<Example[]>();

  selection = new SelectionModel<string>(true, []);
  filters: FormGroup;
  options: RouteData;

  ngOnInit() {
    this.moduleExamples$ = this.dbService.getExamples(ExampleType.Modules)
      .pipe(
        queue(),
        map(res => [
          {
            name: 'Empty',
            json: {
              schema: {},
              layout: {},
              definitions: {}
            }
          },
          {
            name: 'Basic',
            json: {
              schema: DEFAULT_SCHEMA_VALUE,
              layout: DEFAULT_LAYOUT_VALUE,
              definitions: DEFAULT_DEFINITION_VALUE
            }
          },
          ...res.data
        ]),
        shareReplay(1)
      );

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
    ], {
      description: 'MODULES.REMOVE_ONE',
      variables: {
        value: item.name
      }
    });
  }

  deleteSelection() {
    confirmation([
      switchMap(() =>
        forkJoin(
          this.selection.selected.map(id => this.dbService.removeModule(id))
        )
      ),
      notify()
    ], {
      description: this.selection.selected.reduce((acc, cur) =>
        acc + cur + '\n',
        `This action will remove all of the following modules:\n`
      )
    });
  }

  exportToFile(modules: Module[]) {
    modules.forEach(module => {
      saveAs(
        new Blob([JSON.stringify(module)], {type: 'application/json'}),
        `${module.id}.json`
      );
    });
  }

  exportSelected(file = false) {
    this.items$
      .pipe(take(1))
      .subscribe(items => {
          this[file ? 'exportToFile' : 'export'](this.selection.selected.map(id => items.find(item => item.id === id)));
      });
  }

  export(schemes: any[]) {
    console.log(1);
    forkJoin(
      schemes.map(schema => this.dbService.callFunction('cms-jsonSchemaToTypescript', schema))
    )
      .pipe(
        queue(),
        map(res => res.reduce((acc, item: any) => acc + item.data, '')),
        tap((res: string) => {
          this.clipboard.copy(res);
        }),
        notify({
          success: 'MODULES.COPIED_TO_CLIPBOARD'
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  openModuleSelection() {
    this.dialog.open(this.modalTemplate, {
      width: '600px'
    });
  }

  selectModuleExample(item: Example) {
    this.dialog.closeAll();
    this.router.navigate(['/module-definition/single/new'], {state: {example: item.json}});
  }

  openLayout() {
    this.dialog.open(
      LayoutSettingsComponent,
      {
        width: '700px'
      }
    );
  }
}
