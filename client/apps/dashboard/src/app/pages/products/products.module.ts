import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FileUploadModule} from '../../shared/modules/file-upload/file-upload.module';
import {SharedModule} from '../../shared/shared.module';
import {ProductsListComponent} from './pages/list/products-list.component';
import {ProductsSinglePageComponent} from './pages/single-page/products-single-page.component';
import {ProductsComponent} from './products.component';
import {OverviewComponent} from './pages/overview/overview.component';
import {CanDeactivateGuard} from '@jf/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {path: '', component: ProductsListComponent},
      {
        path: ':id',
        component: ProductsSinglePageComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {path: 'single/:id', component: OverviewComponent}
    ]
  }
];

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsListComponent,
    ProductsSinglePageComponent,
    OverviewComponent
  ],
  imports: [SharedModule, FileUploadModule, RouterModule.forChild(routes)],
  providers: []
})
export class ProductsModule {}
