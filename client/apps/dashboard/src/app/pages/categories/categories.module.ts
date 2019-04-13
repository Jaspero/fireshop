import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FileUploadModule} from '../../shared/modules/file-upload/file-upload.module';
import {SharedModule} from '../../shared/shared.module';
import {CategoriesComponent} from './categories.component';
import {CategoriesSinglePageComponent} from './single-page/categories-single-page.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  },
  {
    path: ':id',
    component: CategoriesSinglePageComponent
  }
];

@NgModule({
  declarations: [CategoriesComponent, CategoriesSinglePageComponent],
  imports: [SharedModule, FileUploadModule, RouterModule.forChild(routes)],
  providers: []
})
export class CategoriesModule {}
