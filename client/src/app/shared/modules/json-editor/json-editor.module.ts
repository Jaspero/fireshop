import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {JsonEditorComponent} from './json-editor.component';

@NgModule({
  declarations: [
    JsonEditorComponent
  ],
  exports: [
    JsonEditorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class JsonEditorModule { }
