import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanDeactivateGuard} from '@jf/guards/can-deactivate.guard';
import {FileUploadModule} from '../../shared/modules/file-upload/file-upload.module';
import {SharedModule} from '../../shared/shared.module';
import {ProductsListComponent} from './pages/list/products-list.component';
import {ProductsOverviewComponent} from './pages/overview/products-overview.component';
import {ProductsSinglePageComponent} from './pages/single-page/products-single-page.component';
import {ProductsComponent} from './products.component';

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
      {
        path: 'overview/:id',
        component: ProductsOverviewComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsListComponent,
    ProductsSinglePageComponent,
    ProductsOverviewComponent
  ],
  imports: [SharedModule, FileUploadModule, RouterModule.forChild(routes)],
  providers: []
})
export class ProductsModule {}
