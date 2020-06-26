import {TemplatePortal} from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {Parser, safeEval, State} from '@jaspero/form-builder';
import {RxDestroy} from '@jaspero/ng-helpers';
import {get, has} from 'json-pointer';
import {JSONSchema7} from 'json-schema';
// @ts-ignore
import * as nanoid from 'nanoid';
import {Observable} from 'rxjs';
import {filter, map, shareReplay, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {InstanceOverviewContextService} from '../../modules/module-instance/services/instance-overview-context.service';
import {FilterModule} from '../../shared/interfaces/filter-module.interface';
import {ImportModule} from '../../shared/interfaces/import-module.interface';
import {InstanceSort} from '../../shared/interfaces/instance-sort.interface';
import {ModuleAuthorization} from '../../shared/interfaces/module-authorization.interface';
import {ModuleLayoutTableColumn} from '../../shared/interfaces/module-layout-table.interface';
import {ModuleDefinitions} from '../../shared/interfaces/module.interface';
import {SearchModule} from '../../shared/interfaces/search-module.interface';
import {SortModule} from '../../shared/interfaces/sort-module.interface';
import {DbService} from '../../shared/services/db/db.service';
import {StateService} from '../../shared/services/state/state.service';
import {notify} from '../../shared/utils/notify.operator';

interface TableData {
  moduleId: string;
  authorization?: ModuleAuthorization;
  name: string;
  displayColumns: string[];
  definitions: ModuleDefinitions;
  tableColumns: ModuleLayoutTableColumn[];
  schema: JSONSchema7;
  stickyHeader: boolean;
  sort?: InstanceSort;
  sortModule?: SortModule;
  filterModule?: FilterModule;
  searchModule?: SearchModule;
  importModule?: ImportModule;
  hideCheckbox?: boolean;
  hideEdit?: boolean;
  hideAdd?: boolean;
  hideDelete?: boolean;
  hideExport?: boolean;
  hideImport?: boolean;
  actions?: Array<(it: any) => string>;
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

  @ViewChild('populateColumn', {static: true})
  populateColumnTemplate: TemplateRef<any>;

  data$: Observable<TableData>;
  items$: Observable<any>;

  parserCache: {[key: string]: Parser} = {};
  populateCache: {[key: string]: Observable<any>} = {};

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
        let tableColumns: ModuleLayoutTableColumn[];
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
              acc[key] = data.layout.table[key] ?
                typeof data.layout.table[key] === 'boolean' ?
                  true :
                  data.layout.table[key].includes(this.state.role) :
                false;
              return acc;
            }, {});

            if (data.layout.table.actions) {
              hide.actions = data.layout.table.actions.reduce((acc, cur) => {
                if (!cur.authorization || cur.authorization.includes(this.state.role)) {
                  const parsed = safeEval(cur.value);

                  if (parsed) {
                    acc.push(parsed);
                  }
                }

                return acc;
              }, [])
            }

            if (data.layout.table.hideAdd) {
              hide.hideAdd = typeof data.layout.table.hideAdd === 'boolean' ?
                true :
                data.layout.table.hideAdd.includes(this.state.role);
            }
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
          moduleAuthorization: data.authorization,
          name: data.name,
          schema: data.schema,
          displayColumns,
          tableColumns,
          sort,
          definitions: data.definitions,
          ...(
            data.layout ? {
              stickyHeader: data.layout.table && data.layout.table.hasOwnProperty('stickyHeader') ? data.layout.table.stickyHeader : true,
              sortModule: data.layout.sortModule,
              filterModule: data.layout.filterModule,
              searchModule: data.layout.searchModule,
              importModule: data.layout.importModule,
              ...hide
            } : {
              stickyHeader: true
            }
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
    column: ModuleLayoutTableColumn,
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
          State.Edit,
          this.state.role
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
      } else if (column.populate) {
        let id;

        try {
          id = get(rowData, column.key as string);
        } catch (e) {}


        if (!id) {
          return new TemplatePortal(
            this.simpleColumnTemplate,
            this.viewContainerRef,
            {value: column.populate.fallback || '-'}
          );
        }

        const popKey = `${column.populate.collection}-${
          column.populate.lookUp ?
            [column.populate.lookUp.key, column.populate.lookUp.operator, id].join('-') :
            id
        }`;

        if (!this.populateCache[popKey]) {
          if (column.populate.lookUp) {
            this.populateCache[popKey] = this.dbService.getDocuments(
              column.populate.collection,
              1,
              undefined,
              undefined,
              [{
                ...column.populate.lookUp,
                value: id
              }]
            )
              .pipe(
                map(docs => docs[0] ?
                  (docs[0].data())[column.populate.displayKey || 'name'] || column.populate.fallback || '-' :
                  column.populate.fallback || '-'
                ),
                shareReplay(1)
              )
          } else {
            this.populateCache[popKey] = this.dbService.getDocument(
              column.populate.collection,
              id
            )
              .pipe(
                map(it => it[column.populate.displayKey || 'name'] || column.populate.fallback || '-'),
                shareReplay(1)
              )
          }
        }

        return new TemplatePortal(
          this.populateColumnTemplate,
          this.viewContainerRef,
          {value: this.populateCache[popKey]}
        )
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
