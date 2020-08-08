import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FbModule} from '../../../../shared/modules/fb/fb.module';
import {ExportComponent} from './components/export/export.component';
import {FilterTagsComponent} from './components/filter-tags/filter-tags.component';
import {ImportComponent} from './components/import/import.component';
import {CanReadModuleGuard} from '../../../../shared/guards/can-read-module/can-read-module.guard';
import {FilterDialogComponent} from './components/filter-dialog/filter-dialog.component';
import {SearchInputComponent} from './components/search-input/search-input.component';
import {SortDialogComponent} from './components/sort-dialog/sort-dialog.component';
import {ForceDisableDirective} from './directives/force-disable/force-disable.directive';
import {ModuleInstanceComponent} from './module-instance.component';
import {InstanceOverviewComponent} from './pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './pages/instance-single/instance-single.component';
import {ColumnPipe} from './pipes/column.pipe';

const routes: Routes = [
  {
    path: ':id',
    component: ModuleInstanceComponent,
    canActivate: [
      CanReadModuleGuard
    ],
    children: [
      {
        path: 'overview',
        component: InstanceOverviewComponent
      },
      {
        path: 'single/:id',
        component: InstanceSingleComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    ModuleInstanceComponent,
    InstanceOverviewComponent,
    InstanceSingleComponent,

    ExportComponent,
    ImportComponent,
    SearchInputComponent,
    FilterTagsComponent,

    /**
     * Dialogs
     */
    FilterDialogComponent,
    SortDialogComponent,

    /**
     * Pipes
     */
    ColumnPipe,

    /**
     * Directives
     */
    ForceDisableDirective
  ],
  providers: [
    InstanceOverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FbModule
  ]
})
export class ModuleInstanceModule { }
