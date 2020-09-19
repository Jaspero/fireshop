import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {TranslocoModule} from '@ngneat/transloco';
import {SearchInputComponent} from './search-input.component';

@NgModule({
  declarations: [
    SearchInputComponent
  ],
  exports: [
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    /**
     * Material
     */
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,

    /**
     * External
     */
    TranslocoModule
  ]
})
export class SearchInputModule { }
