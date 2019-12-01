import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ColumnPipe} from './pipes/column.pipe';
import {ShowFieldPipe} from './pipes/show-field.pipe';

const routes: Routes = [];

const PIPES = [ColumnPipe, ShowFieldPipe];

@NgModule({
  declarations: [
    ...PIPES
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ModuleInstanceModule { }
