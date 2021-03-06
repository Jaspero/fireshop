import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FileManagerComponent, JMSPFileManagerModule} from '@jaspero/jmsp-file-manager';

const routes: Routes = [{
  path: '',
  component: FileManagerComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    JMSPFileManagerModule
  ]
})
export class FileManagerModule { }
