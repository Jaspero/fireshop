import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {ComponentType, FormBuilderComponent} from '@jaspero/form-builder';
import {Observable} from 'rxjs';
import {map, shareReplay, take} from 'rxjs/operators';
import {ExampleType} from '../../../../shared/enums/example-type.enum';
import {Example} from '../../../../shared/interfaces/example.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {queue} from '../../../../shared/utils/queue.operator';
import {SNIPPET_FORM_MAP} from '../../../module-instance/consts/snippet-form-map.const';

@Component({
  selector: 'jms-snippet-dialog',
  templateUrl: './snippet-dialog.component.html',
  styleUrls: ['./snippet-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnippetDialogComponent implements OnInit {
  constructor(
    private dbService: DbService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SnippetDialogComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild(FormBuilderComponent, {static: false})
  compiledFormComponent: FormBuilderComponent;

  snippetForm: FormGroup;
  snippetExamples$ = new Observable<Example[]>();
  data: any;

  ngOnInit() {
    this.snippetExamples$ = this.dbService.getExamples(ExampleType.Snippets)
      .pipe(
        queue(),
        map(res => res.data),
        shareReplay(1)
      );

    this.snippetForm = this.fb.group({
      snippet: [ComponentType.Input, Validators.required],
      name: ['', Validators.required],
      label: '',
      required: false
    });

    this.snippetForm
      .get('snippet')
      .valueChanges
      .subscribe(res => {

        this.data = undefined;
        this.cdr.markForCheck();

        setTimeout(() => {
          this.data = SNIPPET_FORM_MAP[res];
          this.cdr.markForCheck();
        });
      });
  }

  submit() {
    this.snippetExamples$
      .pipe(
        take(1)
      )
      .subscribe(examples => {
        this.dialogRef.close([
          this.snippetForm.getRawValue(),
          this.compiledFormComponent ? this.compiledFormComponent.form : {},
          examples
        ]);
      });
  }
}
