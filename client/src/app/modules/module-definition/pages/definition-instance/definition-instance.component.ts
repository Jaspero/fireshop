import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
// @ts-ignore
import {Observable, of} from 'rxjs';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {ViewState} from '../../../../shared/enums/view-state.enum';
import {Module} from '../../../../shared/interfaces/module.interface';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '../../../../shared/utils/notify.operator';
import {SchemaValidation} from '../../../../shared/utils/schema-validation';
import {DEFINITION_AUTOCOMPLETE} from './consts/definition-autocomplete.const';
import {DEFINITION_TEMPLATES} from './consts/definition-templates.const';
import {LAYOUT_AUTOCOMPLETE} from './consts/layout-autocomplete.const';
import {LAYOUT_TEMPLATES} from './consts/layout-templates.const';
import {SCHEMA_AUTOCOMPLETE} from './consts/schema-autocomplete.const';
import {SCHEMA_TEMPLATES} from './consts/schema-templates.const';
import {DEFAULT_SCHEMA_VALUE} from './consts/default-schema-value.const';
import {DEFAULT_LAYOUT_VALUE} from './consts/default-layout-value.const';

@Component({
  selector: 'jms-definition-instance',
  templateUrl: './definition-instance.component.html',
  styleUrls: ['./definition-instance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionInstanceComponent implements OnInit {
  constructor(
    private dbService: DbService,
    private router: Router,
    private state: StateService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  initialValue: string;
  currentValue: string;
  viewState = ViewState;
  currentState: ViewState;
  schemaValidation: SchemaValidation;

  // https://github.com/josdejong/jsoneditor/blob/develop/docs/api.md
  schemaOptions = {
    templates: SCHEMA_TEMPLATES,
    autocomplete: SCHEMA_AUTOCOMPLETE
  };
  layoutOptions = {
    templates: LAYOUT_TEMPLATES,
    autocomplete: LAYOUT_AUTOCOMPLETE
  };
  definitionsOptions = {
    templates: DEFINITION_TEMPLATES,
    autocomplete: DEFINITION_AUTOCOMPLETE
  };

  form$: Observable<FormGroup>;

  ngOnInit() {
    this.schemaValidation = new SchemaValidation();

    this.form$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        if (params.id === 'new') {
          this.currentState = ViewState.New;
          return of({});
        } else if (params.id.endsWith('--copy')) {
          this.currentState = ViewState.Copy;
          return this.state.modules$.pipe(
            map(modules =>
              modules.find(
                module => module.id === params.id.replace('--copy', '')
              )
            )
          );
        } else {
          this.currentState = ViewState.Edit;
          return this.state.modules$.pipe(
            map(modules => modules.find(module => module.id === params.id))
          );
        }
      }),
      map((value: Partial<Module>) => {
        const form = this.fb.group({
          id: {value: value.id, disabled: this.currentState === ViewState.Edit},
          createdOn:
            this.currentState === ViewState.Edit ? value.createdOn : Date.now(),
          name: [value.name || '', Validators.required],
          description: value.description || '',
          schema: value.schema || DEFAULT_SCHEMA_VALUE,
          layout: value.layout || DEFAULT_LAYOUT_VALUE,
          definitions: value.definitions || {}
        });

        this.initialValue = JSON.stringify(form.getRawValue());
        this.currentValue = JSON.stringify(this.initialValue);

        return form;
      }),
      shareReplay(1)
    );
  }

  save(form: FormGroup) {
    return () => {
      const {id, ...data} = form.getRawValue();

      const {error} = this.schemaValidation.validate(data);

      if (error) {
        this.snackBar.open(
          'Schema invalid. Check console for more information.',
          'Dismiss',
          {
            panelClass: 'snack-bar-error',
            duration: 5000
          }
        );

        console.error(error);

        return of({});
      }

      return this.state.modules$.pipe(
        take(1),
        switchMap(modules => {
          if (!data.layout.hasOwnProperty('order')) {
            data.layout.order = modules.length;
          }

          return this.dbService.setModule(data, id);
        }),
        notify(),
        tap(() => this.back())
      );
    };
  }

  back() {
    this.initialValue = '';
    this.currentValue = '';
    this.router.navigate(['/module-definition/overview']);
  }

  duplicate(form: FormGroup) {
    this.router.navigate([
      '/module-definition/single',
      `${form.get('id').value}--copy`
    ]);
  }

  move(forward: boolean, form: FormGroup) {}
}
