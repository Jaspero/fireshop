import {TemplatePortal} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, Injector, OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {DocumentChangeAction} from '@angular/fire/firestore';
import {MatSort} from '@angular/material';
import {RxDestroy} from '@jaspero/ng-helpers';
import {get, has} from 'json-pointer';
import {JSONSchema7} from 'json-schema';
// @ts-ignore
import * as nanoid from 'nanoid';
import {Observable} from 'rxjs';
import {filter, map, shareReplay, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {InstanceSingleState} from '../../modules/module-instance/enums/instance-single-state.enum';
import {InstanceOverviewContextService} from '../../modules/module-instance/services/instance-overview-context.service';
import {Parser} from '../../modules/module-instance/utils/parser';
import {safeEval} from '../../modules/module-instance/utils/safe-eval';
import {FilterModule} from '../../shared/interfaces/filter-module.interface';
import {InstanceSort} from '../../shared/interfaces/instance-sort.interface';
import {ModuleDefinitions, TableColumn} from '../../shared/interfaces/module.interface';
import {SearchModule} from '../../shared/interfaces/search-module.interface';
import {SortModule} from '../../shared/interfaces/sort-module.interface';
import {DbService} from '../../shared/services/db/db.service';
import {StateService} from '../../shared/services/state/state.service';
import {notify} from '../../shared/utils/notify.operator';

interface TableData {
  moduleId: string;
  name: string;
  displayColumns: string[];
  definitions: ModuleDefinitions;
  tableColumns: TableColumn[];
  schema: JSONSchema7;
  sort?: InstanceSort;
  sortModule?: SortModule;
  filterModule?: FilterModule;
  searchModule?: SearchModule;
  hideCheckbox?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  hideExport?: boolean;
  hideImport?: boolean;
}

@Component({
  selector: 'jms-e-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent extends RxDestroy implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    public ioc: InstanceOverviewContextService,
    private state: StateService,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef,
    private dbService: DbService
  ) {
    super();
  }

  /**
   * Using view children so we can listen for changes
   */
  @ViewChildren(MatSort)
  sort: QueryList<MatSort>;

  @ViewChild('subHeaderTemplate', {static: true})
  subHeaderTemplate: TemplateRef<any>;

  @ViewChild('simpleColumn', {static: true})
  simpleColumnTemplate: TemplateRef<any>;

  data$: Observable<TableData>;
  items$: Observable<any>;

  parserCache: {[key: string]: Parser} = {};

  ngOnInit() {

    /**
     * Component isn't necessarily destroyed
     * before it's instantiated again
     */
    setTimeout(() => {
      this.ioc.subHeaderTemplate$.next(this.subHeaderTemplate);
    }, 100);

    this.data$ = this.ioc.module$.pipe(
      map(data => {
        let displayColumns: string[];
        let tableColumns: TableColumn[];
        let sort: InstanceSort;
        let hide: any = {
          hideCheckbox: false,
          hideAdd: false,
          hideEdit: false,
          hideDelete: false,
          hideExport: false,
          hideImport: false,
        };

        if (
          data.layout &&
          data.layout.table &&
          data.layout.table.tableColumns
        ) {

          /**
           * Filter authorized columns
           */
          const pColumns = data.layout.table.tableColumns.filter(column =>
            column.authorization ? column.authorization.includes(this.state.role) : true
          );

          displayColumns = pColumns.reduce(
            (acc, column) => {
              let key =
                typeof column.key === 'string' ? column.key : column.key[0];

              if (acc.includes(key)) {
                key = nanoid();
              }

              acc.push(key);

              return acc;
            },
            []
          );
          tableColumns = pColumns.map(column => {

            const tooltip = column.tooltip ? safeEval(column.tooltip as string) : column.tooltip;

            return {
              ...column,
              ...tooltip && {
                tooltip,
                tooltipFunction: typeof tooltip === 'function'
              }
            };
          });
        } else {
          const topLevelProperties = Object.keys(data.schema.properties || {});

          displayColumns = topLevelProperties.reduce((acc, key) => {
            acc.push(key || nanoid());
            return acc;
          }, []);
          tableColumns = topLevelProperties.map(key => ({
            // Make the key a valid json pointer
            key: '/' + key,
            label: key
          }));
        }

        if (data.layout) {

          sort = data.layout.sort;

          if (data.layout.table) {
            hide = [
              'hideCheckbox',
              'hideEdit',
              'hideDelete',
              'hideExport',
              'hideImport'
            ].reduce((acc, key) => {
              acc[key] = data.layout.table[key] ? data.layout.table[key].includes(this.state.role) : false;
              return acc;
            }, {});
          }
        }

        if (!hide.hideCheckbox) {
          displayColumns.unshift('check');
        }

        if (!hide.hideDelete || !hide.hideEdit) {
          displayColumns.push('actions');
        }

        return {
          moduleId: data.id,
          name: data.name,
          schema: data.schema,
          displayColumns,
          tableColumns,
          sort,
          definitions: data.definitions,
          ...(
            data.layout ? {
              sortModule: data.layout.sortModule,
              filterModule: data.layout.filterModule,
              searchModule: data.layout.searchModule,
              ...hide
            } : {}
          )
        };
      }),
      shareReplay(1)
    );

    this.items$ = this.data$
      .pipe(
        switchMap(data =>
          this.ioc.items$
            .pipe(
              map(items =>
                items
                  .map(item => this.mapRow(
                    data,
                    item
                  )
                )
              )
            )
        )
      );
  }

  ngAfterViewInit() {
    this.sort.changes.pipe(
      startWith(this.sort),
      filter(change => change.last),
      switchMap(change => change.last.sortChange),
      takeUntil(this.destroyed$)
    )
      .subscribe((value: any) => {
        this.ioc.sortChange$.next(value);
      });
  }

  ngOnDestroy() {
    this.ioc.subHeaderTemplate$.next(null);
    super.ngOnDestroy();
  }

  private mapRow(
    overview: TableData,
    rowData: any
  ) {
    const {id, ...data} = rowData;

    return {
      data,
      id,
      parsed: this.parseColumns(overview, {...data, id})
    };
  }

  private parseColumns(overview: TableData, rowData: any) {
    return overview.tableColumns.reduce((acc, column, index) => {
      acc[index] = {
        value: this.getColumnValue(column, overview, rowData),
        ...(column.nestedColumns
          ? {
            nested: this.parseColumns(
              {...overview, tableColumns: column.nestedColumns},
              rowData
            )
          }
          : {})
      };
      return acc;
    }, {});
  }

  private getColumnValue(
    column: TableColumn,
    overview: TableData,
    rowData: any,
    nested = false
  ) {
    if (column.control) {
      const key = column.key as string;

      if (!this.parserCache[rowData.id]) {
        this.parserCache[rowData.id] = new Parser(
          overview.schema,
          this.injector,
          InstanceSingleState.Edit
        );
        this.parserCache[rowData.id].buildForm(rowData);
      }

      const field = this.parserCache[rowData.id].field(
        key,
        this.parserCache[rowData.id].pointers[key],
        overview.definitions,
        false
      );

      field.control.valueChanges
        .pipe(
          switchMap(value =>
            this.dbService.setDocument(
              overview.moduleId,
              rowData.id,
              {
                [Parser.standardizeKey(key)]: value
              },
              {merge: true}
            )
          ),
          notify({
            success: null
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe();

      return field.portal;
    } else {
      let value;

      if (typeof column.key !== 'string') {
        value = column.key
          .map(key => this.getColumnValue({key}, overview, rowData, true))
          .join(column.hasOwnProperty('join') ? column.join : ', ');
      } else {
        if (has(rowData, column.key)) {
          value = this.ioc.columnPipe.transform(
            get(rowData, column.key),
            column.pipe,
            column.pipeArguments,
            rowData
          );
        } else {
          value = '';
        }
      }

      if (nested) {
        return value;
      } else {
        return new TemplatePortal(
          this.simpleColumnTemplate,
          this.viewContainerRef,
          {value}
        );
      }
    }
  }
}
