import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule, Routes} from '@angular/router';
import {LoadClickModule, SanitizeModule} from '@jaspero/ng-helpers';
import {TranslocoModule} from '@ngneat/transloco';
import {ELEMENTS} from '../../../../elements/elements.const';
import {CanReadModuleGuard} from '../../../../shared/guards/can-read-module/can-read-module.guard';
import {FormBuilderSharedModule} from '../../../../shared/modules/fb/form-builder-shared.module';
import {SearchInputModule} from '../../../../shared/modules/search-input/search-input.module';
import {ExportComponent} from './components/export/export.component';
import {FilterDialogComponent} from './components/filter-dialog/filter-dialog.component';
import {FilterTagsComponent} from './components/filter-tags/filter-tags.component';
import {ImportComponent} from './components/import/import.component';
import {SortDialogComponent} from './components/sort-dialog/sort-dialog.component';
import {ForceDisableDirective} from './directives/force-disable/force-disable.directive';
import {ModuleInstanceComponent} from './module-instance.component';
import {InstanceOverviewComponent} from './pages/instance-overview/instance-overview.component';
import {InstanceSingleComponent} from './pages/instance-single/instance-single.component';
import {ColumnPipe} from './pipes/column/column.pipe';
import {ParseTemplatePipe} from './pipes/parse-template/parse-template.pipe';
import {InstanceOverviewContextService} from './services/instance-overview-context.service';

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
    ParseTemplatePipe,

    /**
     * Directives
     */
    ForceDisableDirective,

    ...ELEMENTS
  ],
  providers: [
    InstanceOverviewContextService
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    /**
     * Local
     */
    FormBuilderSharedModule,
    SearchInputModule,

    /**
     * Material
     */
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    DragDropModule,
    MatCardModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    PortalModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatSlideToggleModule,

    /**
     * Ng Helpers
     */
    LoadClickModule,
    SanitizeModule,

    /**
     * External
     */
    TranslocoModule
  ]
})
export class ModuleInstanceModule { }
