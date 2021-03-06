import {SelectionModel} from '@angular/cdk/collections';
import {ChangeDetectorRef, Inject, Injectable, Optional, TemplateRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {MaybeArray, TRANSLOCO_LANG, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService} from '@ngneat/transloco';
import {BehaviorSubject, combineLatest, forkJoin, Observable, Subject} from 'rxjs';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {ModuleLayoutTableColumn} from '../../../../../shared/interfaces/module-layout-table.interface';
import {ExportComponent} from '../components/export/export.component';
import {PAGE_SIZES} from '../../../../../shared/consts/page-sizes.const';
import {FilterModule} from '../../../../../shared/interfaces/filter-module.interface';
import {InstanceSort} from '../../../../../shared/interfaces/instance-sort.interface';
import {Module} from '../../../../../shared/interfaces/module.interface';
import {SortModule} from '../../../../../shared/interfaces/sort-module.interface';
import {WhereFilter} from '../../../../../shared/interfaces/where-filter.interface';
import {DbService} from '../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../shared/services/state/state.service';
import {confirmation} from '../../../../../shared/utils/confirmation';
import {notify} from '../../../../../shared/utils/notify.operator';
import {FilterDialogComponent} from '../components/filter-dialog/filter-dialog.component';
import {SortDialogComponent} from '../components/sort-dialog/sort-dialog.component';
import {ColumnPipe} from '../pipes/column/column.pipe';

@Injectable()
export class InstanceOverviewContextService {
  constructor(
    private state: StateService,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private dbService: DbService,
    private transloco: TranslocoService,
    @Optional()
    @Inject(TRANSLOCO_SCOPE)
    private providerScope: MaybeArray<TranslocoScope>,
    @Optional()
    @Inject(TRANSLOCO_LANG)
    private providerLang: string | null
  ) {}

  module$: Observable<Module>;
  items$: Observable<any[]>;

  columnPipe: ColumnPipe;
  loading$ = this.state.loadingQue$
    .pipe(
      map(items => !!items.length)
    );
  routeData: any;
  allChecked$: Observable<{checked: boolean}>;
  emptyState$: BehaviorSubject<boolean>;
  filterChange$: BehaviorSubject<WhereFilter[]>;
  sortChange$: BehaviorSubject<InstanceSort>;
  hasMore$: BehaviorSubject<boolean>;
  loadMore$: Subject<boolean>;
  searchControl: FormControl;
  selection: SelectionModel<string>;
  pageSizes = PAGE_SIZES;
  subHeaderTemplate$ = new Subject<TemplateRef<any>>();

  pageSize: FormControl;

  openFilterDialog(
    data: FilterModule
  ) {
    this.filterChange$
      .pipe(
        take(1),
        switchMap(filterValue =>
          this.dialog.open(FilterDialogComponent, {
            ...data.dialogOptions || {},
            width: '800px',
            data: {
              ...data,
              value: filterValue ?
                filterValue.reduce((acc, cur) => {
                  acc[cur.key] = cur.value;
                  return acc;
                }, {}) :
                data.value
            }
          })
            .afterClosed()
        ),
        filter(value => !!value)
      )
      .subscribe(value => {
        this.filterChange$.next(value);
      });
  }

  openSortDialog(
    collection: string,
    collectionName: string,
    options: SortModule
  ) {
    this.dialog.open(SortDialogComponent, {
      width: '800px',
      data: {
        options,
        collection,
        collectionName
      }
    });
  }

  deleteSelection(moduleId: string) {
    confirmation(
      [
        switchMap(() =>
          forkJoin(
            this.selection.selected.map(id =>
              this.dbService.removeDocument(moduleId, id)
            )
          )
        ),
        tap(() => {
          this.selection.clear();
        }),
        notify()
      ],
      {
        description: this.selection.selected.reduce((acc, cur) =>
          acc + cur + '\n',
          `${this.transloco.translate('INSTANCE_OVERVIEW.REMOVE_ITEMS_WARNING')}\n`
        )
      }
    );
  }

  deleteOne(moduleId: string, item: any) {
    confirmation(
      [
        switchMap(() => this.dbService.removeDocument(moduleId, item.id)),
        tap(() => {
          if (this.selection.selected.length && this.selection.selected.some(it => it === item.id)) {
            this.selection.deselect(item.id);
          }
        }),
        notify()
      ],
      {
        description: 'INSTANCE_OVERVIEW.REMOVE_ONE',
        variables: {
          value: item.id
        }
      }
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

  export(columns?: ModuleLayoutTableColumn[]) {

    combineLatest([
      this.module$,
      this.filterChange$,
      this.sortChange$
    ])
      .pipe(
        take(1)
      )
      .subscribe(([module, filterValue, sort]) => {
        this.bottomSheet.open(ExportComponent, {
          data: {
            ids: this.selection.selected,
            filterValue,
            columns,
            sort,
            collection: module.id,
            filterModule: module.layout?.filterModule,
          }
        });
      })
  }

  trackById(index, item) {
    return item.id;
  }

  setUp(
    cdr: ChangeDetectorRef
  ) {
    this.columnPipe = new ColumnPipe(
      this.domSanitizer,
      this.transloco,
      cdr,
      this.providerScope,
      this.providerLang,
      this.dbService
    );

    this.columnPipe.ioc = this;
  }
}
